import React from "react";

import { FaFacebookSquare, FaLinkedin, FaGithubSquare, FaInstagramSquare } from "react-icons/fa";
import AppStoreIcon from "../../shared/assets/icons/AppstoreDownload.svg";
import PlayStoreIcon from "../../shared/assets/icons/PlaystoreDownload.svg";
import "./Footer.css";

const Footer = () =>  {
    return (
        <footer className="landing__footer">
            <div className="footer-links">
                <a href="#">Sobre Nós</a>
                <a href="#">Ajuda</a>
                <a href="#">Política de Privacida</a>
                <a href="#">Termos e Condições</a>
            </div>
            <div className="footer-social-media">
                <div className="social__icon"><FaFacebookSquare /></div>
                <div className="social__icon"><FaLinkedin /></div>
                <div className="social__icon"><FaGithubSquare /></div>
                <div className="social__icon"><FaInstagramSquare/></div>
            </div>
            <div className="footer-app-stores">
                <img src={AppStoreIcon} alt="app store" />
                <img src={PlayStoreIcon} alt="app store" />
            </div>
            <div className="footer-rights">
                <p>© 2021 Bacle Jobs. Todos os direitos reservados</p>
            </div>
        </footer>
    )
}

export default Footer;