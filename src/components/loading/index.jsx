import React from "react";
import "./loading.css";

const index = ({ label, loading }) => {
  return (
    <div className="container">
      <div className={`spinner ${loading && "loading"} `}>
        <div className="spinner__ball"></div>
      </div>
      <p className="label">{label}</p>
    </div>
  );
};

export default index;
