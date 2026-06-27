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
      <div className="modal-content">
        <h2>Choose How to Connect</h2>
        <p>
          No Coinbase Wallet extension was found. You can still mint your Aaarto
          NFT:
        </p>
        <ul>
          <li>
            <strong>Use Coinbase Wallet mobile app</strong> — scan the QR code
            below to connect instantly.
          </li>
          <li>
            <strong>Install Coinbase Wallet extension</strong> — for desktop
            users who prefer browser‑based minting.
          </li>
        </ul>

        {/* QR code placeholder */}
        <div id="qrCodeContainer">
          {/* Replace with dynamic QR code from SDK */}
          <img
            src="qr-placeholder.png"
            alt="Scan with Coinbase Wallet mobile app"
            style={{ width: "200px", margin: "20px auto" }}
          />
        </div>

        <div className="modal-actions">
          <button className="primary" onClick={onScanMobile}>
            Scan with Mobile App
          </button>
          <button className="secondary" onClick={onInstallExtension}>
            Install Extension
          </button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default NoWallet;
