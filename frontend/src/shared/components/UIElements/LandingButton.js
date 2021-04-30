import React from "react";

import "./LandingButton.css";

const LandingButton = props => {
    return <button className={`landing-button ${props.className}`}><b>{props.children}</b></button>
}

export default LandingButton;