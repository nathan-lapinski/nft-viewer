import React, { useEffect, useState } from "react";
import "./App.css";
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import MintNFT from "./data/MintNFT.json";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ALCHEMY_API_KEY } from "./config/config";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const URL_BASE = "https://gateway.pinata.cloud/ipfs/";
const Card = () => {
  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    // Fetch pinned data
    fetch(
      "https://gateway.pinata.cloud/ipfs/QmQ5pt4GTqzwXRKniwsdJc1RM3cTkG5tyVcXzsuwZ1USWi"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setImgUrl(`${URL_BASE}${data.image.substring(7)}`);
      })
      .catch(console.log);
  }, []);
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div className="card">
        <img src={imgUrl || "img.jpeg"} alt="John" style={{ width: "100%" }} />
        <h1>Dr.Strangelove</h1>
        <p className="title">CTO &amp; Founder, Mad Scientist</p>
      </div>
    </div>
  );
};

export function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <img src={ensAvatar} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector?.name}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector?.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}

const ConnectToWeb3 = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
};

const PinToIPFS = (props) => {
  const [cid, setCid] = useState();
  console.log(props)

  useEffect(() => {
    if (props.imgId && !cid) {
    fetch('http://localhost:4009/pin', {
      method: "POST",
      mode: "cors",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({imgId: props.imgId})
    }).then(res => res.json()).then(res => {

      console.log("GOT ", res)
      if (res.cid) {
        setCid(res.cid);
      } else {
        console.log(`Error from pinning service ${res}`);
      }
    });
  }
  }, [props.imgId]);

  if (!cid) {
    return null;
  }

  return (<MintNFTButton contentId={cid} />)
}

const MintNFTButton = (props) => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: "0x0A3101077F080cF9FEDdf88dd94D14C5Ab7E50d3",
    contractInterface: MintNFT.abi,
    functionName: "mintNFT",
    args: [
      "0x278fC1451C73a47696bbDb847fc5831A2f1e6Da8",
      `https://gateway.pinata.cloud/ipfs/${props.contentId}`
      // `https://gateway.pinata.cloud/ipfs/QmQ5pt4GTqzwXRKniwsdJc1RM3cTkG5tyVcXzsuwZ1USWi`,
    ],
  });
  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
console.log(props.contentId)
  return (
    <div>
      <button disabled={!write || isLoading} onClick={() => write()}>
        {isLoading ? "Minting..." : "Mint"}
      </button>
      {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan Link</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </div>
  );
};

const TestImageGen = () => {
  const [imgUrl, setImgUrl] = useState();
  const [imgId, setImgId] = useState();
  const testGen = async () => {
    const imgRes = await fetch('http://localhost:4009/generate').then(res => res.json());
    console.log(imgRes);
    setImgUrl(imgRes.url);
    setImgId(imgRes.imgId);
  };

  return (
    <div>
      <button onClick={() => testGen()}>TEST IMAGE GEN</button>
      {imgUrl && <img src={imgUrl} />}

      {/* {imgUrl && (<MintNFTButton imgId={imgUrl}/>)} */}
      {imgUrl && (<PinToIPFS imgId={imgId}/>)}
    </div>
  );
};

const App = () => {
  return (
    <WagmiConfig client={client}>
      <ConnectToWeb3 />
      <Profile />
      <Card />
      {/* <MintNFTButton /> */}
      <TestImageGen />
    </WagmiConfig>
  );
};
export default App;
