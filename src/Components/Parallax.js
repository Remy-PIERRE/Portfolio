import { useState, useEffect, useRef } from "react";
import useWindowWidth from "../Hooks/useWindowWidth";
import ParallaxUnit from "./ParallaxUnit";

function Parallax() {
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

  return (
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
      </div>
    </section>
  );
}

export default Parallax;
