import { useState, useEffect, useRef, useContext } from "react";
import useWindowWidth from "../Hooks/useWindowWidth";
import ParallaxUnit from "../Components/ParallaxUnit";
import { ToggleLoadingContext } from "../Context/ToggleLoadingContext";

function Home() {
  /* check if loading screen is closed */
  const { isReady, isOpen } = useContext(ToggleLoadingContext);

  useEffect(() => {
    if (isOpen || !isReady) return;
    setTimeout(() => {
      setAnimationState(1);
    }, 1000);
  }, [isReady]);

  /* settings */
  const totalUnits = 12;
  const imgWidth = 978;
  const speed = 10;

  /* calc number of imgs need by unit to cover the screen */
  const windowWidth = useWindowWidth();
  const parallaxRef = useRef();
  const [imgsByUnit, setImgByUnit] = useState(1);

  useEffect(() => {
    if (!parallaxRef.current) return;
    calcImgsByUnit();
  }, [windowWidth]);

  const calcImgsByUnit = () => {
    const parallaxWidth = parallaxRef.current.getBoundingClientRect().width;
    setImgByUnit(Math.ceil(parallaxWidth / imgWidth) + 1);
  };

  /* title animation */
  const [animationStage, setAnimationState] = useState(0);

  const titleTopRef = useRef();
  const titleCenterRef = useRef();

  useEffect(() => {
    const listenerHandler = () => {
      setAnimationState((prevState) => prevState + 1);
    };
    if (animationStage === 1) {
      titleTopRef.current.addEventListener("transitionend", listenerHandler);
      return () => {
        if (titleTopRef.current)
          titleTopRef.current.removeEventListener(
            "transitionend",
            listenerHandler
          );
      };
    }
    if (animationStage === 2) {
      setTimeout(() => {
        listenerHandler();
      }, 2700);
    }
    if (animationStage === 3) {
      setTimeout(() => {
        listenerHandler();
      }, 2000);
    }
  }, [animationStage]);
  return (
    <main className="home__body">
      <section ref={parallaxRef} className="home__parallax__body">
        <div className="home__parallax__frame" />
        <div className="home__parallax__screen">
          {[...Array(totalUnits)].map((el, ind) => (
            <ParallaxUnit
              key={ind}
              index={ind}
              speed={speed + totalUnits - ind + 1}
              imgsNumber={imgsByUnit}
            />
          ))}
          <div
            ref={titleTopRef}
            className="home__animatedTitle__top__wrapper flexRowCC"
            style={{ opacity: animationStage >= 1 ? "1" : null }}
          >
            <img src="/images/logo_remdev_row.png" />
            <p>présente</p>
          </div>

          <div
            ref={titleCenterRef}
            className="home__animatedTitle__center__wrapper flexRowCC"
            style={{
              animation:
                animationStage === 4 ? "titleCenterAnim 1.75s infinite " : null,
            }}
          >
            <div className="flexRowCC">
              {["r", "e", "m", "y"].map((el, ind) => (
                <img
                  key={ind}
                  src={`/images/letter_${el}.png`}
                  style={{
                    transitionDelay: `${ind * 0.15}s`,
                    transform: animationStage >= 2 ? "translateZ(0)" : null,
                    opacity: animationStage >= 2 ? "1" : null,
                  }}
                />
              ))}
            </div>
            <div className="flexRowCC">
              {["p", "i", "e", "r", "r", "e"].map((el, ind) => (
                <img
                  key={ind}
                  src={`/images/letter_${el}.png`}
                  style={{
                    transitionDelay: `${ind * 0.2 + 1}s`,
                    transform: animationStage >= 2 ? "translateZ(0)" : null,
                    opacity: animationStage >= 2 ? "1" : null,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="home__animatedTitle__bottom__wrapper">
            <p
              style={{
                transform: animationStage >= 3 ? "translateY(0%)" : null,
                opacity: animationStage >= 3 ? "1" : null,
              }}
            >
              Développeur web junior
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
