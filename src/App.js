import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Commenter from "./components/comment";
import abi from "./utils/wavePortal.json";
import "./App.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  const [total, setTotal] = useState(0);

  const contractAddress = "0x17cf72Ec8d9313BfD19C99828C5D45c1ffdF43a0";

  const contractABI = abi.abi;

  //  Create a method that gets all waves from your contract
  const getAllWaves = async () => {
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

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        console.log(waves);
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        getAllWaves();
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

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <div className="app_container">
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            <span>👋</span> Hey there!
          </div>

          <div className="bio">
            I am Taro and I'm fullStack developer , that's pretty cool right? ?
            Connect your Ethereum wallet and wave at me!
          </div>

          <h2 className="number">
            Total Wave : <span>{total}</span>{" "}
          </h2>

          {/* <button className="waveButton" onClick={wave}>
            Wave at Me
          </button> */}

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {currentAccount && (
        <Commenter
          allWaves={allWaves}
          setTotal={setTotal}
          contractAddress={contractAddress}
        />
      )}
    </div>
  );
}
