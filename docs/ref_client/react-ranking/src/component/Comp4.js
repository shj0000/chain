
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

class Comp4 extends React.Component {

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
    const creatorAddress = new PublicKey(
      "2KgSbEGLo64knHru5CDsf3Gsf5WjVXXr7a9oiaakxEzb"
    );
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

    //owner
    const account = conn
      .getTokenAccountsByOwner(creatorAddress, {
        programId: TOKEN_PROGRAM_ID
      })
      .then((el0) => {
        console.log("el0", el0);
        el0.value.forEach((el00) => {
          // pubkey = Token Account:Address
          // maybe data=mint
          // console.log(deData);
          //deserializeAccount
          //deserializeMint
          const deData = deserializeAccount(el00.account.data);
          const amount = parseInt(deData.amount);

          console.log(deData);
          if (amount > 0) {
            console.log(
              new PublicKey(deData.mint).toString(),
              amount,
              deserializeMint(deData.mint)

            );
          };
        });
      });

  };


  render() {
    return <h1 onClick={this.test}>Button - List - Token Info By Owner - {this.props.name}</h1>;
  }
}

export default Comp4;
