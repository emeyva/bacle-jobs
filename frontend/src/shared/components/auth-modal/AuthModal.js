import React from "react";
import ReactDOM from "react-dom";

import "./AuthModal.css";

const AuthModal = () => {
  const authModal = () => {
    return (
      <div className="curtain">
        <div className="curtain__panel curtain__panel-left"></div>
        <div className="curtain__panel curtain__panel-left"></div>
      </div>
    );
  };

  return ReactDOM.createPortal(authModal(), document.getElementById('auth-hook'));
};

export default AuthModal;
