import React from "react";

interface NoWalletProps {
  show: boolean;
  onClose: () => void;
  onScanMobile: () => void;
  onInstallExtension: () => void;
}

const NoWallet: React.FC<NoWalletProps> = ({
  show,
  onClose,
  onScanMobile,
  onInstallExtension,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <h2>Connect Your Wallet</h2>
          <p>
            We didn’t find the Coinbase Wallet browser extension. You can still
            mint your Aaarto NFT by choosing one of these options:
          </p>
          <ul>
            <li>
              <strong>Use the Base mobile app</strong>— scan the QR code in the
              pop up displayed.
            </li>
            <li>
              <strong>Install the Coinbase Wallet extension</strong> — for
              desktop users who prefer browser‑based minting.
            </li>
          </ul>
          {/* <div className="qr-section">
            <p>Scan with Base app:</p>
            <img id="qr" src="" alt="WalletConnect QR code" />
          </div> */}
          {/* <div className="modal-actions">
            <button className="primary">Scan with Base app</button>
            <button className="secondary">Install Extension</button>
            <button className="secondary">Cancel</button>
          </div> */}
        </div>
      </div>

      {/* <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: #fff;
          padding: 20px;
          width: 420px;
          border-radius: 8px;
          text-align: center;
        }
        .modal-actions {
          margin-top: 20px;
        }
        .modal-actions button {
          margin: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .primary {
          background: #0052ff;
          color: #fff;
        }
        .secondary {
          background: #eee;
        }
      `}</style> */}
    </div>
  );
};

export default NoWallet;
