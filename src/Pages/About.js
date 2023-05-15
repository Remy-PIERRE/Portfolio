import { useState, useEffect, useRef, useContext } from "react";
import { ToggleLoadingContext } from "../Context/ToggleLoadingContext";

function About() {
  /* handle selection of section with click on dedicated button and animation */
  const [selectedSection, setSelectedSection] = useState(0);
  const [aboutInAnimation, setAboutInAnimation] = useState(false);

  /* launch animation */
  const toggleSectionHandler = () => {
    if (aboutInAnimation) return;
    setAboutInAnimation("out");
    window.scrollTo({
      top: 100,
      left: 0,
      behavior: "smooth",
    });
  };

  /* from anim "out" to anim "in" */
  useEffect(() => {
    if (!aboutInAnimation) return;
    setTimeout(() => {
      if (aboutInAnimation === "out") {
        setSelectedSection((prevState) => (prevState === 0 ? 1 : 0));
        setAboutInAnimation("in");
      }
      if (aboutInAnimation === "in") setAboutInAnimation(false);
    }, 2000);
  }, [aboutInAnimation]);

  /*  for route change (from section 1 bottom buttons) */
  const { changeRouteHandler } = useContext(ToggleLoadingContext);

  /* text jsx */
  let text;
  if (selectedSection === 0)
    text = [
      " A 18 ans, bac scientifique en poche, j'entre dans le monde du travail. Multipliant les experiences au grès des oportunités, je recherche un métier qui me procure satisfaction...",
      "...Passionné de logique et de résolutions de problèmes, c'est à 36 ans que je décide de rejoindre le monde du développement web et intègre une formation OpenClassRooms...",
      "... Juillet 2023, me voici diplômé et pret à mettre mes compétences à votre service.",
    ];
  if (selectedSection === 1)
    text = [
      "Polyvalent, persevérant et toujours ouvert à apprendre, je serai ravi de vous accompagner dans la réalisation de votre projet. Ensemble, nous réaliserons votre site Internet, de la rédaction du cahier des charges à la mise en ligne du site.",
      "N'hésitez pas à consulter mes différentes réalisations disponibles dans la galerie afin d'attester de mon travail et/ou de trouver des idées pour votre propre site. Vous pouvez me contacter à tout moment depuis la section Contact.",
      "À bientôt pour la suite !",
    ];

  const selectedText = text.map((el, ind) => {
    return (
      <p
        key={ind}
        className="section__paraph"
        style={{
          animation:
            aboutInAnimation == "out"
              ? "blurAnim 2.5s forwards"
              : aboutInAnimation == "in"
              ? "blurAnim 2.5s forwards reverse"
              : null,
        }}
      >
        {el}
      </p>
    );
  });

  /* toggle button jsx */
  const [toggleButtonIndex, setToggleButtonIndex] = useState(0);

  const toggleButtons = [...Array(3)].map((el, ind) => {
    return (
      <img
        key={ind}
        src={
          toggleButtonIndex === ind
            ? "/icons/chevron_bottom_black.png"
            : "/icons/chevron_bottom_grey.png"
        }
      />
    );
  });

  /* toggle button animation */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setToggleButtonIndex((prevState) =>
        prevState === 2 ? 0 : prevState + 1
      );
    }, 250);
    return () => clearTimeout(timeoutId);
  });

  return (
    <main className="about__body outlet__body">
      <h1 className="about__title page__title outlet__box">
        Bonjour, je suis Rémy Pierre...
      </h1>

      <section className="about__section flexRowCC">
        <div className="about__section__imgAndTitle__wrapper flexColCC">
          <div className="about__section__img__wrapper flexRowCC">
            <div className="outlet__box">
              <img
                src={selectedSection === 0 ? "/images/portrait_rem.png" : null}
                style={{
                  animation:
                    aboutInAnimation == "out"
                      ? "blurAnim 2.5s forwards"
                      : aboutInAnimation == "in"
                      ? "blurAnim 2.5s forwards reverse"
                      : null,
                }}
              />
            </div>
          </div>

          <div className="about__section__text__title flexRowCC">
            <div className=" outlet__box">
              <h2
                className="section__title"
                style={{
                  animation:
                    aboutInAnimation == "out"
                      ? "blurAnim 2.5s forwards"
                      : aboutInAnimation == "in"
                      ? "blurAnim 2.5s forwards reverse"
                      : null,
                }}
              >
                {selectedSection === 0 ? (
                  <>... développeur web junior.</>
                ) : (
                  <>... je réalise votre site.</>
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="about__section__text__paraph outlet__box flexColCC">
          {selectedText}
        </div>

        {selectedSection === 1 && (
          <div className="about__section__navButtons__wrapper">
            <button onClick={() => changeRouteHandler("/galerie")}>
              GALERIE
              <div />
            </button>
            <button onClick={() => changeRouteHandler("/contact")}>
              CONTACT
              <div />
            </button>
          </div>
        )}

        <div
          className="about__section__toggleButton__wrapper flexRowCC"
          onClick={toggleSectionHandler}
        >
          <button className="flexColCC">{toggleButtons}</button>
        </div>
      </section>
    </main>
  );
}

export default About;
