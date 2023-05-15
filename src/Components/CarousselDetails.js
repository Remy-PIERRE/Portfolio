import { useState, useEffect } from "react";
import useWindowWidth from "../Hooks/useWindowWidth";

function CarousselDetails({ data, nextIndex }) {
  /* getting window width */
  const windowWidth = useWindowWidth();

  /* settings */
  const anim =
    windowWidth < 976
      ? "carousselDetailsImgAnimMob 1s forwards"
      : "carousselDetailsImgAnimDesk 1s forwards";
  const translateDuration = 1000;
  const changeImgDuration = 5000;

  /* img screen handler */
  const [index, setIndex] = useState(0);
  const [inAnimation, setInAnimation] = useState({
    screen: false,
    imgs: false,
  });

  /* timer on change img */
  useEffect(() => {
    if (!data || data.imgs.length <= 1) return;
    const timeoutId = setTimeout(() => {
      setInAnimation({
        screen: false,
        imgs: true,
      });
    }, changeImgDuration);
    return () => clearTimeout(timeoutId);
  }, [index, data]);

  useEffect(() => {
    if (!inAnimation["imgs"]) return;
    const timeoutId = setTimeout(() => {
      setIndex((prevState) =>
        prevState === data.imgs.length - 1 ? 0 : prevState + 1
      );
      setInAnimation({
        screen: false,
        imgs: false,
      });
    }, translateDuration);
    return () => clearTimeout(timeoutId);
  }, [inAnimation]);

  /* reset index on change data */
  useEffect(() => {
    if (!data) return;
    setIndex(0);
  }, [data]);

  /* handle caroussel index change */
  const bigScreenAnim = nextIndex
    ? windowWidth < 976
      ? `carousselBigScreenAnimMob ${nextIndex.timer / 1000}s forwards`
      : `carousselBigScreenAnimDesk ${nextIndex.timer / 1000}s forwards`
    : null;

  useEffect(() => {
    if (!nextIndex) return;
    setInAnimation({
      screen: true,
      imgs: false,
    });
  }, [nextIndex]);

  useEffect(() => {
    if (!inAnimation["screen"]) return;
    setTimeout(() => {
      setInAnimation({
        screen: false,
        imgs: false,
      });
    }, nextIndex.timer);
  }, [inAnimation]);

  return (
    <section className="carousselDetails__body">
      <div className="outlet__box carousselDetails__title__wrapper">
        <h2>Détails</h2>
      </div>

      <div className="carousselDetails__wrapper outlet__box">
        <div
          className="carousselDetails__bigScreen"
          style={{
            animation: inAnimation["screen"] ? bigScreenAnim : null,
          }}
        >
          <div className="carousselDetails__actualIndex__wrapper">
            <div
              key={inAnimation["imgs"]}
              className="carousselDetails__img__screen flexRowCC"
              style={{ animation: inAnimation["imgs"] ? anim : null }}
            >
              {data && (
                <>
                  <div className="carousselDetails__img__wrapper outlet__box">
                    <img
                      src={`images/${data.imgs[index]}.png`}
                      className="imgCover"
                    />
                  </div>
                  <div className="carousselDetails__img__wrapper outlet__box">
                    <img
                      src={`images/${
                        index === data.imgs.length - 1
                          ? data.imgs[0]
                          : data.imgs[index + 1]
                      }.png`}
                      className="imgCover"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="carousselDetails__text__wrapper outlet__box">
              {data && (
                <div className="carousselDetails__text ">
                  <p>{data.desc2}</p>
                </div>
              )}
            </div>
          </div>

          {nextIndex && (
            <div className="carousselDetails__nextIndex__wrapper">
              <div className="carousselDetails__nextIndex__img__wrapper outlet__box">
                <img
                  src={`images/${nextIndex.data.imgs[0]}.png`}
                  className="imgCover"
                />
              </div>

              <div className="carousselDetails__text__wrapper outlet__box">
                <div className="carousselDetails__text ">
                  <p>{nextIndex.data.desc2}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CarousselDetails;
