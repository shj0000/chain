
import React, { useEffect, useState } from "react";

import * as solanaWeb3 from "@solana/web3.js";
import {
  Keypair,
  clusterApiUrl,
  Commitment,
  Connection,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  Blockhash,
  FeeCalculator,
  PublicKey
} from "@solana/web3.js";

import {
  TokenInfo,
  TokenListProvider,
  ENV as ChainId
} from "@solana/spl-token-registry";
import * as borsh from "borsh";

import {
  AccountAndPubkey,
  Metadata,
  METADATA_SCHEMA
} from "./processMaetaplexAccounts";
import { deserializeMint, deserializeAccount } from "./deserialize";

// const {struct, u32, ns64} = require("@solana/buffer-layout");
// const {Buffer} = require('buffer');
// const web3 = require("@solana/web3.js");

class Comp6 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  static getDerivedStateFromProps(props, state) {
    return {favoritecolor: props.favcol };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({favoritecolor: "yellow"})
    }, 1000)
    console.log("test");
  }

  async test(e) {
    console.log("solanaWeb3");
    console.log(solanaWeb3);

    const METADATA_REPLACE = new RegExp("\u0000", "g");
    function decodeMetadata(buffer) {
      console.log("check");
      // return borsh.deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer);

      const metadata = borsh.deserializeUnchecked(
        METADATA_SCHEMA,
        Metadata,
        buffer
      );
      metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, "");
      metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, "");
      metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, "");
      return metadata;
    }

    const ENDPOINTS = [
      {
        name: "mainnet-beta",
        endpoint: "https://api.metaplex.solana.com/",
        ChainId: ChainId.MainnetBeta
      },
      {
        name: "mainnet-beta (Solana)",
        endpoint: "https://api.mainnet-beta.solana.com",
        ChainId: ChainId.MainnetBeta
      },
      {
        name: "mainnet-beta (Serum)",
        endpoint: "https://solana-api.projectserum.com/",
        ChainId: ChainId.MainnetBeta
      },
      {
        name: "testnet",
        endpoint: clusterApiUrl("testnet"),
        ChainId: ChainId.Testnet
      },
      {
        name: "devnet",
        endpoint: clusterApiUrl("devnet"),
        ChainId: ChainId.Devnet
      }
    ];

    const DEFAULT = ENDPOINTS[0].endpoint;
    const conn = new Connection(DEFAULT, "recent");

    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    //
    // const creatorAddress = new PublicKey(
    //   "2KgSbEGLo64knHru5CDsf3Gsf5WjVXXr7a9oiaakxEzb"
    // );
    //const mintAddress = "Hu8k9rabgTxqcwM95o2ng4UQmxakepZ4w2YLJMTW4F3u";
    //2KgSbEGLo64knHru5CDsf3Gsf5WjVXXr7a9oiaakxEzb
    //Hu8k9rabgTxqcwM95o2ng4UQmxakepZ4w2YLJMTW4F3u
    alert(3);
    const MAX_NAME_LENGTH = 32;
    const MAX_URI_LENGTH = 200;
    const MAX_SYMBOL_LENGTH = 10;
    const MAX_CREATOR_LEN = 32 + 1 + 1;
    const TOKEN_PROGRAM_ID = new PublicKey(
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    );

    const reducePromises = (
      array,
      callback// [A]
    ) =>
      array.reduce(
        (
          prevPrms,
          currElem,
          index // [B]
        ) =>
          prevPrms.then(async (prevRes) => {
            console.log(array.length, index);
            const currRes = await callback(currElem, index); // [C]
            return [...prevRes, currRes];
          }),
        Promise.resolve([])
    );

    const getRecentTokenAddrOfHolder = (mintAddrs) => {
      // 임시 개수 제한..??
      // const slicedMintAddrs = mintAddrs.slice(0, 20);
      const slicedMintAddrs = mintAddrs;

      reducePromises(slicedMintAddrs, (mintAddr) => {
        return conn
          .getTokenLargestAccounts(mintAddr, "confirmed")
          .then((res) => {
            const recentTokenAddrOfHolder = new PublicKey(res.value[0].address);
            //console.log(mintAddrs.length, recentTokenAddrOfHolder.toString());
            return recentTokenAddrOfHolder;
          });
      })
      .then((recentTokenAddrs) => {
          console.log(recentTokenAddrs);
          return reducePromises(recentTokenAddrs, (recentTokenAddr) => {
            return conn
              .getAccountInfo(recentTokenAddr, "confirmed")
              .then((account) => {
                const data = deserializeAccount(account.data);
                const owner = new PublicKey(data.owner).toString();
                return owner;
              });
          });
      })
      .then((owners) => {
          console.log("owners", owners);
          const summaryMap = new Map();
          owners.forEach((owner) => {
            if (typeof summaryMap.get(owner) === "undefined") {
              summaryMap.set(owner, 1);
            } else {
              summaryMap.set(owner, summaryMap.get(owner) + 1);
            }
          });
          console.log("summaryMap", summaryMap);
          const summaryArr = Array.from(summaryMap);
          console.log("summaryArr", summaryArr);
          const sortedSummaryArr = summaryArr.sort((a, b) => {
            return b[1] - a[1];
          });
          console.log("sortedSummaryArr", sortedSummaryArr);
      });
    };

    console.log("start");
    //slime
    //JAVGVpREYzCA6b1WgQFsdDw4zNdZjCUruE4monFpkWx1
    //solbabe
    //DfgeRH7yuNP7D5VSdJrq96ZzumhUVNMzoxaq5EDoYUxr
    //nekoverse
    //J7J2MnxHNT3MonYcXPqmXYCyvR8bpBdGsR5XLLsfYcDf


    // update auth 인가??
    const creatorAddress = new PublicKey(
      "pQFTF4tJCryuujaXH6bSUygJHon4ivp6H8PuCZWjPZJ"
    );
    //owner //JAVGVpREYzCA6b1WgQFsdDw4zNdZjCUruE4monFpkWx1

    // 민팅거까지 포함해서 찾기 위한 방법..?
    // by update auth
    conn
      .getProgramAccounts(
        TOKEN_METADATA_PROGRAM_ID,

        {
          filters: [
            {
              memcmp: {
                offset: 1,
                bytes: creatorAddress.toBase58()
              }
            }
          ]
        }
      )
      .then((nfts) => {
        console.log("nfts count", nfts.length);
        return nfts.map(
          (nft) => new PublicKey(decodeMetadata(nft.account.data).mint)
        );
      })


      // air drop 카운트용
      // conn
      //   .getTokenAccountsByOwner(creatorAddress, {
      //     programId: TOKEN_PROGRAM_ID
      //   })
      // .then((tokenAccs) => {
      //   const mintAddrs = tokenAccs.value.map((tokenAcc) => {
      //     const mintAddr = new PublicKey(
      //       deserializeAccount(tokenAcc.account.data).mint
      //     );
      //     return mintAddr;
      //   });
      //   return mintAddrs;
      // })
      .then((mintAddrs) => {
        const recentTokenAddrs = getRecentTokenAddrOfHolder(mintAddrs);

        console.log("recentTokenAddrs", recentTokenAddrs);
        // return mintAddrs.map((mintAddr) => {
        //   //return conn.getTokenLargestAccounts(mintAddr, "confirmed");
        // });
      });

    // const mintAddr = new PublicKey(
    //   "5X74X5w7saQ69L66gaDXTCMbyyoJR4QwAoRSS1uFrZfj"
    // );
    // conn
    //   .getTokenLargestAccounts(mintAddr, "confirmed")
    //   .then((elLargestAccounts) => {
    //     console.log("elLargestAccounts", elLargestAccounts);
    //     const recentHolder = new PublicKey(elLargestAccounts.value[0].address);
    //     console.log("elLargestAccounts", recentHolder.toString());
    //   });

    // const tokenAccountAddr = new PublicKey(
    //   "25mYohCMjSwhGTLNe8d6Psu7G9UE3bqBKUvaRPYqr4yt"
    // );
    // conn.getAccountInfo(tokenAccountAddr, "confirmed").then((account) => {
    //   const data = deserializeAccount(account.data);
    //   const owner = new PublicKey(data.owner);
    //   console.log("data", data);
    //   console.log("owner", owner.toString());
    // });
  };


  render() {
    return <h1 onClick={this.test}>Button - holder analyzer{this.props.name}</h1>;
  }
}

export default Comp6;
