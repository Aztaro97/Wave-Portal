import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Loader from "./components/loading";
import abi from "./utils/wavePortal.json";
import "./App.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const [loading, setLoading] = useState(false);
  const [mined, setMined] = useState(false);

  const contractAddress = "0x9b9A3Bec4A6Db156c90D8847b1fF5720E9D71B11";

  const contractABI = abi.abi;

  const checkIfWalletIsConnect = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log("MetaMask is installed ");
      } else {
        alert("Make sure you have MetaMask");
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        console.log(currentAccount);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        setLoading(true);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        setLoading(false);
        setMined(true);
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span>👋</span> Hey there!
        </div>

        <div className="bio">
          I am Taro and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>

      {loading ? (
        <Loader label="mining..." loading={loading} />
      ) : mined ? (
        <Loader label="mined" loading={loading} />
      ) : null}
    </div>
  );
}
