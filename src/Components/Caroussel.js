import { useState, useEffect } from "react";
import useWindowWidth from "../Hooks/useWindowWidth";

function Caroussel({ data, indexHandler }) {
  /* settings */
  const contentAnimDuration = 375;
  const panelAnimDuration = 750;

  /* get window width to select what animation caroussel panels must do */
  const windowWidth = useWindowWidth();

  /* handle animation, panel and content */
  const [inAnimation, setInAnimation] = useState({
    panel: false,
    content: false,
  });
  const [indexDirection, setIndexDirection] = useState();

  /* content animation settings */
  const contentAnim =
    inAnimation["content"] === "out"
      ? `carousselContentAnim ${contentAnimDuration / 1000}s forwards`
      : inAnimation["content"] === "in"
      ? `carousselContentAnimReverse ${contentAnimDuration / 1000}s forwards`
      : null;

  /* key for forcing rerendering panels */
  const [panelKey, setPanelKey] = useState(0);
  let panelAnim;

  /* panel animation settings */
  if (windowWidth < 976) {
    panelAnim =
      inAnimation["panel"] === "out"
        ? `carousselPaneltAnimOut ${panelAnimDuration / 2000}s forwards linear`
        : `carousselPaneltAnimIn ${panelAnimDuration / 2000}s forwards linear`;
  }

  if (windowWidth >= 976) {
    panelAnim =
      panelKey % 2 === 0
        ? `carousselPaneltAnimTranslateIn ${
            panelAnimDuration / 1000
          }s forwards linear`
        : `carousselPaneltAnimTranslateOut ${
            panelAnimDuration / 1000
          }s forwards linear`;
  }

  /* get index change */
  const buttonHandler = (direction) => {
    if (windowWidth < 976) {
      setInAnimation({
        panel: "out",
        content: "out",
      });
    }
    if (windowWidth >= 976) {
      setInAnimation({
        panel: "translate",
        content: "out",
      });
    }
    setIndexDirection(direction);
  };

  /* listen to end animation "out" of content then change it */
  useEffect(() => {
    if (!inAnimation["content"]) return;
    if (inAnimation["content"] === "out") {
      const duration =
        windowWidth < 976 ? panelAnimDuration * 2 : panelAnimDuration;
      indexHandler(indexDirection, duration);
      setTimeout(() => {
        const animations = { ...inAnimation };
        animations["content"] = "in";
        setInAnimation(animations);
      }, contentAnimDuration);
    }
    if (inAnimation["content"] === "in") {
      setTimeout(() => {
        setInAnimation({
          panel: false,
          content: false,
        });
      }, contentAnimDuration);
    }
  }, [inAnimation]);

  return (
    <section className="caroussel__body">
      <div className="caroussel__screen outlet__box">
        <div className="caroussel__logo__wrapper">
          <img src="/images/logo_remdev.png" />
        </div>

        <div
          key={panelKey}
          className="caroussel__panel img__panel"
          style={{
            animation: panelAnim,
          }}
        >
          {data && (
            <img
              src={`/images/${data.cover}.png`}
              className="imgCover"
              style={{ animation: inAnimation["content"] ? contentAnim : null }}
            />
          )}
        </div>
        <div
          key={panelKey + 1}
          className="caroussel__panel text__panel flexRowCC"
          style={{ animation: `${panelAnim} reverse` }}
        >
          <div
            className="caroussel__text__wrapper flexColCC"
            style={{ animation: inAnimation["content"] ? contentAnim : null }}
          >
            {data && (
              <>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <div className="caroussel__text__techno__wrapper">
                  {data.techno.map((el, ind) => (
                    <img key={ind} src={`/icons/${el}.png`} />
                  ))}
                </div>
                <div className="caroussel__text__links__wrapper">
                  {data.links["git"] && (
                    <a href={data.links.git}>
                      <img src="/icons/github.png" />
                    </a>
                  )}
                  {data.links["site"] && (
                    <a href={data.links.site}>
                      <img src="/icons/site.png" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="caroussel__buttons__wrapper">
        <img
          src="images/chevron.png"
          onClick={() => {
            if (["in", "out", "translate"].includes(inAnimation["panel"]))
              return;
            buttonHandler("prev");
            setPanelKey((prevState) => prevState + 1);
          }}
          style={{ transform: "rotate(90deg)" }}
        />
        <img
          src="images/chevron.png"
          onClick={() => {
            if (["in", "out", "translate"].includes(inAnimation["panel"]))
              return;
            buttonHandler("next");
            setPanelKey((prevState) => prevState + 1);
          }}
          style={{ transform: "rotate(-90deg)" }}
        />
      </div>
    </section>
  );
}

export default Caroussel;
