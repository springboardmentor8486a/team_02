import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Logout Confirmation</h3>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">Are you sure you want to logout?</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-btn cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="modal-btn confirm-btn"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
