import React from "react";
import Wallet from "./Wallet";
import WalletTxns from "./WalletTxns";
import WalletRequests from "./WalletRequests";

const WalletLayout = () => {
  return (
    <>
      <Wallet />
      <WalletTxns />
      <WalletRequests />
    </>
  );
};

export default WalletLayout;
