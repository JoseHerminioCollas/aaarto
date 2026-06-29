import React from "react";
import { mergeStyleSets } from "@fluentui/react";

const mintControlStyles = mergeStyleSets({
  container: {
    backgroundColor: "lightblue",
    padding: "0.5em",
    selectors: {
      button: {
        color: "#eee",
        backgroundColor: "darkblue",
        fontSize: "1.25em",
        cursor: "pointer",
        borderRadius: "5%",
      },
    },
  },
});

const labels = {
  mint: "Mint The Aaarto",
  minting: "Minting, Please Wait...",
};

export type MintControlProps = {
  handleMint: () => void;
  isMinting: boolean;
};

const MintControl: React.FC<MintControlProps> = ({ handleMint, isMinting }) => {
  return (
    <section className={mintControlStyles.container}>
      <button disabled={true}>
        Minting Temporarily Disabled
      </button>
      {/* <button onClick={handleMint} disabled={isMinting}>
        {isMinting ? labels.minting : labels.mint}
      </button> */}
    </section>
  );
};

export default MintControl;
