import React from "react";

const LoadingScreen: React.FC = () => {

  return (
    <>
      <div className="loading-screen-container flexed">
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    </>
  );
};

export default LoadingScreen;