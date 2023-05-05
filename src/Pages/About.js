import { useState } from "react";

function About() {
  /* section toggle handler */
  const [firstsection, setFirstSection] = useState(true);

  const toggleSectionHandler = () => {
    setFirstSection((prevState) => !prevState);
    window.scrollTo(0, 0);
  };

  return (
    <main className="about__body">
      <h1 className="about__section__title">Bonjour, je suis Rémy Pierre...</h1>
      {firstsection && (
        <section className="about__section">
          <div className="about__section__img__wrapper">
            <img src="/images/portrait_ours.png" />
          </div>
          <div className="about__section__text__wrapper">
            <h3>... développeur web junior.</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Provident, itaque quibusdam alias quos ut exercitationem, harum
              ipsam, molestiae voluptatibus aliquam consequuntur dolore! Amet
              possimus voluptatem at quis laboriosam earum ab?
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis
              dolorem minima id doloribus, est eaque quo incidunt? Officiis,
              expedita ut!
            </p>
          </div>
          <div
            className="about__section__toggle__wrapper"
            onClick={toggleSectionHandler}
          >
            <img src="/images/chevron.png" />
          </div>
        </section>
      )}

      {!firstsection && (
        <section className="about__section">
          <div
            className="about__section__toggle__wrapper"
            onClick={toggleSectionHandler}
          >
            <img
              src="/images/chevron.png"
              style={{ transform: "rotate(180deg)" }}
            />
          </div>
          <div className="about__section__text__wrapper">
            <h3>... je réalise votre site.</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
              architecto, dignissimos eius neque sapiente totam itaque a fugiat
              molestiae cupiditate aut harum omnis iste modi.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              soluta laboriosam quod eligendi necessitatibus corrupti magni esse
              labore eum. Adipisci earum dignissimos atque dolor inventore
              voluptas officiis nemo facilis quae. Velit, perspiciatis expedita
              unde ab voluptatem nihil eaque consectetur facere.
            </p>
          </div>
          <div className="about__links__wrapper">
            <button>Compétences</button>
            <button>Contact</button>
          </div>
          <div className="about__section__img__wrapper width__big">
            <img src="/images/devweb__art.jpg" />
          </div>
        </section>
      )}
    </main>
  );
}

export default About;
