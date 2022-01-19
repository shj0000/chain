
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

class Comp5 extends React.Component {

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

    conn
      .getProgramAccounts(
        TOKEN_METADATA_PROGRAM_ID,

        {
          filters: [
            {
              memcmp: {
                offset:
                  1 + // key
                  32 + // update auth
                  32 + // mint
                  4 + // name string length
                  MAX_NAME_LENGTH + // name
                  4 + // uri string length
                  MAX_URI_LENGTH + // uri*
                  4 + // symbol string length
                  MAX_SYMBOL_LENGTH + // symbol
                  2 + // seller fee basis points
                  1 + // whether or not there is a creators vec
                  4 + // creators vec length
                  0 * MAX_CREATOR_LEN,
                bytes: creatorAddress.toBase58()
              }
            }
          ]
        }
      )
      .then((el) => {
        console.log("el1", el);
        console.log("el11", el[0].account.data.toString());

        console.log(decodeMetadata(el[0].account.data));
        var res = decodeMetadata(el[0].account.data);
        var resAddr = res.data.creators[0].address;
        var pubKey = new PublicKey(resAddr);
        console.log("###", pubKey.toString());
        console.log("######");
        // decodeMetadata(el[0].account.data.toString()).then((reEl) =>
        //   console.log("el111", reEl)
        // );
      });

    const mintAddress = new PublicKey(
      "kz2UZ6WBqg1KzfyYZUFh7mJkApa8MmUZDuGNYpVLNZr"
    );
    //4itgFt6tSotypyVAaUkLJzpGQ5KXsJNhwpKBANMv49mf
    //DrMT4YPqc8FjSNQKLKHhWwh1fLL5j6Q51ezPurWZK9Dm
    conn
      .getProgramAccounts(
        TOKEN_METADATA_PROGRAM_ID,

        {
          filters: [
            {
              memcmp: {
                offset: 1 + 32, // key // update auth
                bytes: mintAddress.toString()
              }
            }
          ]
        }
      )
      .then((el) => {
        console.log("el2", el);
        console.log("el22", el[0].account.data.toString());
      });

    const newValue = `${e.target.value}`.trim().toLowerCase();

  };


  render() {
    return <h1 onClick={this.test}>Button - Send - Account Info{this.props.name}</h1>;
  }
}

export default Comp5;
