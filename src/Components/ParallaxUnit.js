import React from "react";

function ParallaxUnit({ index, speed, imgsNumber }) {
  const animation = `parallaxUnitAnim_${imgsNumber} ${speed}s infinite linear`;

  return (
    <div
      className="home__parallax__unit__wrapper"
      style={{ animation, zIndex: 20 - index }}
    >
      {[...Array(imgsNumber)].map((el, ind) => {
        return (
          <div
            key={ind}
            style={{
              backgroundImage: `url("/home_parallax/layer_${index}.png")`,
            }}
          />
        );
      })}
    </div>
  );
}
export default ParallaxUnit;
