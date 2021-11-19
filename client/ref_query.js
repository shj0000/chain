import "./styles.css";

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

import { SerumLink } from "./components/SerumLink";
import { BridgeLink } from "./components/BridgeLink";
import { AssetLink } from "./components/AssetLink";
import { CoinGeckoLink } from "./components/CoinGeckoLink";
import {
  AccountAndPubkey,
  Metadata,
  METADATA_SCHEMA
} from "./processMaetaplexAccounts";
import { deserializeMint, deserializeAccount } from "./deserialize";

export default function App() {
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
  // test\
  useEffect(() => {
    console.log("TokenListProvider init.");
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByChainId(ChainId.MainnetBeta).getList();

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    });
  }, [setTokenMap]);

  const [symbolText, setSymbolText] = useState("");
  const [tokens, setTokens] = useState<TokenInfo[]>([]);

  const handleChange = (e: any) => {
    console.log("solanaWeb3");
    console.log(solanaWeb3);

    const METADATA_REPLACE = new RegExp("\u0000", "g");
    function decodeMetadata(buffer: any) {
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

    type ENV =
      | "mainnet-beta"
      | "mainnet-beta (Solana)"
      | "mainnet-beta (Serum)"
      | "testnet"
      | "devnet"
      | "localnet"
      | "lending";

    const ENDPOINTS = [
      {
        name: "mainnet-beta" as ENV,
        endpoint: "https://api.metaplex.solana.com/",
        ChainId: ChainId.MainnetBeta
      },
      {
        name: "mainnet-beta (Solana)" as ENV,
        endpoint: "https://api.mainnet-beta.solana.com",
        ChainId: ChainId.MainnetBeta
      },
      {
        name: "mainnet-beta (Serum)" as ENV,
        endpoint: "https://solana-api.projectserum.com/",
        ChainId: ChainId.MainnetBeta
      },
      {
        name: "testnet" as ENV,
        endpoint: clusterApiUrl("testnet"),
        ChainId: ChainId.Testnet
      },
      {
        name: "devnet" as ENV,
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
          // console.log(el00.pubkey.toBase58());
          //deserializeAccount
          //deserializeMint
          console.log(deserializeAccount(el00.account.data));
          console.log(
            new PublicKey(deserializeAccount(el00.account.data).mint).toString()
          );
          //Buffer.from(el00.account.data, "base64")
        });
      });

    conn.getProgramAccounts(
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
    setSymbolText(newValue);

    const result: TokenInfo[] = [];
    if (newValue.length > 0) {
      for (const token of tokenMap.values()) {
        const { symbol } = token;
        if (symbol.toLowerCase().includes(newValue)) {
          result.push(token);
        }
      }
    }
    setTokens(result);
  };

  return (
    <div className="App">
      <h1>Solana Token Search</h1>
      <div>
        Symbol: <input value={symbolText} onChange={handleChange} />
      </div>
      <div>count: {tokens.length}</div>

      {tokens.map((token, idx) => (
        <div key={`${idx}`}>
          <div className="icon">
            <img src={token.logoURI} alt={token.name} />
          </div>
          <div>
            {token.symbol} ({token.decimals})
          </div>
          <div>
            <a
              target="_blank"
              rel="noreferrer"
              href={token.extensions?.website ?? "#"}
            >
              {token.name}
            </a>
          </div>
          <div>{token.address}</div>
          {token.extensions?.bridgeContract && (
            <div>
              <BridgeLink bridgeContract={token.extensions.bridgeContract} />
            </div>
          )}
          {token.extensions?.assetContract && (
            <div>
              <AssetLink assetContract={token.extensions.assetContract} />
            </div>
          )}
          <div className="serumV3">
            {token.extensions?.serumV3Usdt && (
              <span>
                <SerumLink
                  marketId={token.extensions.serumV3Usdt}
                  marketName={`${token.symbol}/USDT`}
                />
              </span>
            )}
            {token.extensions?.serumV3Usdc && (
              <span>
                <SerumLink
                  marketId={token.extensions.serumV3Usdc}
                  marketName={`${token.symbol}/USDC`}
                />
              </span>
            )}
          </div>
          <div>
            {token.extensions?.coingeckoId && (
              <span>
                <CoinGeckoLink coingeckoId={token.extensions.coingeckoId} />
              </span>
            )}
          </div>

          {
            //<pre>{JSON.stringify(token.extensions, null, 2)}</pre>
          }

          <hr />
        </div>
      ))}
    </div>
  );
}

/**
{
  "chainId": 101,
  "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "symbol": "USDC",
  "name": "USD Coin",
  "decimals": 6,
  "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  "tags": [
    "stablecoin"
  ],
  "extensions": {
    "website": "https://www.centre.io/",
    "coingeckoId": "usd-coin",
    "serumV3Usdt": "77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS"
  }
}
 */