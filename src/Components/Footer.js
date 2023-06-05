import { useState } from "react";

function Footer() {
  const [isOpenMentionsLegales, setIsOpenMentionsLegales] = useState(false);

  return (
    <footer className="footer__body flexColCC">
      <div className="footer__socialLinks__wrapper">
        <a href="https://github.com/Remy-PIERRE">
          <img className="pointer" src="/icons/github_2.png" />
        </a>
        <a href="https://www.linkedin.com/in/r%C3%A9my-pierre-537b49266/">
          <img className="pointer" src="/icons/linkedin.png" />
        </a>
        <a href="">
          <img src="/icons/discord.png" />
        </a>
      </div>

      <div className="footer__mentions__wrapper flexColCC">
        <p>Tous droits réservés</p>
        <p className="pointer" onClick={() => setIsOpenMentionsLegales(true)}>
          Mentions légales
        </p>
      </div>

      {isOpenMentionsLegales && (
        <div
          className="mentionsLegales__body flexColCC"
          onClick={() => setIsOpenMentionsLegales(false)}
        >
          <h2>Mentions légales</h2>
          <div className="mentionslegales__text__wraper flexColCC">
            <p>Nom et prénom: Pierre Rémy</p>
            <p>Adresse du domicile: Le Puy Merle, 19320 Clergoux</p>
            <p>Téléphone: 06 75 64 19 86</p>
            <p>Coordonnées de l'hébergeur du site: </p>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
