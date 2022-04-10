import React, { useState } from "react";
import { ethers } from "ethers";
import Loader from "../../components/loading";
import abi from "../../utils/wavePortal.json";
import "./comment.css";

const CommenterComponent = ({ allWaves, setTotal, contractAddress }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mined, setMined] = useState(false);
  const contractABI = abi.abi;

  const handleWave = async (e) => {
    try {
      e.preventDefault();

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
        count && setTotal(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());

        // const waveTxn = await wavePortalContract.wave();
        const waveTxn = await wavePortalContract.wave(message);
        setLoading(true);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        setLoading(false);
        setMined(true);
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setMessage("");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="comment_container">
      <form onSubmit={handleWave} className="form">
        <textarea
          required
          name="message"
          id="message"
          placeholder="Write your message"
          cols="30"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">sent your wave</button>
      </form>

      {allWaves.map((wave, index) => (
        <div className="comment" key={index}>
          <h3 className="comment_address">Address: {wave.address} </h3>
          <p className="comment_date">{wave.timestamp.toString()}</p>
          <p className="comment_message">{wave.message}</p>
        </div>
      ))}

      {loading ? (
        <Loader label="mining..." loading={loading} />
      ) : mined ? (
        <Loader label="mined" loading={loading} />
      ) : null}
    </div>
  );
};

export default CommenterComponent;
