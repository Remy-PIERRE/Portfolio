import { useContext, useEffect, useState, useRef } from "react";
import { GalleryContext } from "../Context/GalleryContext";
import useWindowWidth from "../Hooks/useWindowWidth";
import GalleryDescription from "../Components/GalleryDescription";
import Caroussel from "../Components/Caroussel";

function Gallery() {
  /* get data from context */
  const { galleryData, getGalleryData } = useContext(GalleryContext);

  useEffect(() => {
    if (!galleryData) getGalleryData();
  }, []);

  /* manage filters */
  const [filterSelected, setFilterSelected] = useState("tous");

  const filterSelectedHandler = (filter) => {
    if (filter === "tous" && filterSelected === "tous") return;
    if (filterSelected === filter) return setFilterSelected("tous");
    setFilterSelected(filter);
    setDataIndex(0);
  };

  /* filter data according filter selected */
  const [dataSelected, setDataSelected] = useState();
  const [dataIndex, setDataIndex] = useState(0);

  useEffect(() => {
    if (!galleryData) return;
    if (filterSelected === "tous") return setDataSelected(galleryData);
    const selection = galleryData.filter((el) =>
      el.data.filters.includes(filterSelected)
    );
    setDataSelected(selection);
  }, [filterSelected, galleryData]);

  /* manage responsive */
  const windowWidth = useWindowWidth();

  /* animation handling */
  const [textPanelIsLeft, setTextPanelIsLeft] = useState(true);
  const [inAnimation, setInAnimation] = useState(false);
  const [fading, setFading] = useState(false);
  const animationToLeft = "galleryPanelAnimToLeft 1s forwards";
  const animationToRight = "galleryPanelAnimToRight 1s forwards";
  const animationRespToLeft =
    "galleryPanelRespAnimToLeft 1s forwards cubic-bezier(.25,.5,.75,.49)";
  const animationRespToRight =
    "galleryPanelRespAnimToRight 1s forwards  cubic-bezier(.25,.5,.75,.49)";
  const animationFadingOut = "galleryAnimFadingOut 0.5s forwards";
  const animationFadingIn = "galleryAnimFadingIn 0.5s forwards";

  const textPanelRef = useRef();
  const textWrapperRef = useRef();

  const switchWorkHandler = (direction) => {
    if (inAnimation) return;
    setInAnimation(direction);
    setFading("out");
  };

  useEffect(() => {
    if (!inAnimation || !textPanelRef.current) return;
    const listenerHandler = (event) => {
      if (event.animationName === "galleryAnimFadingOut") return;
      setInAnimation(false);
      setFading(false);
      setTextPanelIsLeft((prevState) => !prevState);
    };
    textPanelRef.current.addEventListener("animationend", listenerHandler);
    return () => {
      if (textPanelRef.current)
        textPanelRef.current.removeEventListener(
          "animationend",
          listenerHandler
        );
    };
  }, [inAnimation]);

  useEffect(() => {
    if (!fading || fading === "in" || !textWrapperRef.current) return;
    const listenerHandler = () => {
      if (inAnimation === "prev") {
        setDataIndex((prevState) =>
          prevState === 0 ? dataSelected.length - 1 : prevState - 1
        );
      }
      if (inAnimation === "next") {
        setDataIndex((prevState) =>
          prevState === dataSelected.length - 1 ? 0 : prevState + 1
        );
      }
      setFading("in");
    };
    textWrapperRef.current.addEventListener("animationend", listenerHandler);
    return () => {
      if (textWrapperRef.current)
        textWrapperRef.current.removeEventListener(
          "animationend",
          listenerHandler
        );
    };
  }, [fading]);

  return (
    <main className="gallery__body">
      <h1 className="gallery__title page__title outlet__box">GALERIE</h1>

      <section className="gallery__filters__wrapper">
        <button
          onClick={() => filterSelectedHandler("tous")}
          className={filterSelected === "tous" ? "active" : null}
        >
          TOUS
        </button>
        <button
          onClick={() => filterSelectedHandler("professionnel")}
          className={filterSelected === "professionnel" ? "active" : null}
        >
          PROFESSIONNEL
        </button>
        <button
          onClick={() => filterSelectedHandler("formation")}
          className={filterSelected === "formation" ? "active" : null}
        >
          FORMATION
        </button>
      </section>

      <Caroussel />

      <section className="gallery__caroussel">
        <div className="gallery__caroussel__screen">
          <img className="gallery__caroussel__background" />

          <div
            className={`gallery__caroussel__imgPanel ${
              textPanelIsLeft ? "right" : "left"
            }`}
            style={{
              animation: inAnimation
                ? windowWidth < 768
                  ? textPanelIsLeft
                    ? animationRespToLeft
                    : animationRespToRight
                  : textPanelIsLeft
                  ? animationToLeft
                  : animationToRight
                : null,
            }}
          >
            {dataSelected && (
              <>
                <img
                  key={fading}
                  src={`/images/${dataSelected[dataIndex].data.cover}.png`}
                  style={{
                    animation: inAnimation
                      ? fading === "out"
                        ? animationFadingOut
                        : animationFadingIn
                      : null,
                  }}
                />
              </>
            )}
          </div>
          <div
            ref={textPanelRef}
            className={`gallery__caroussel__textPanel ${
              textPanelIsLeft ? "left" : "right"
            }`}
            style={{
              animation: inAnimation
                ? windowWidth < 768
                  ? !textPanelIsLeft
                    ? animationRespToLeft
                    : animationRespToRight
                  : !textPanelIsLeft
                  ? animationToLeft
                  : animationToRight
                : null,
            }}
          >
            {dataSelected && (
              <div
                ref={textWrapperRef}
                className="gallery__text__wrapper"
                style={{
                  animation: inAnimation
                    ? fading === "out"
                      ? animationFadingOut
                      : animationFadingIn
                    : null,
                }}
              >
                <div className="gallery__text__title__wrapper">
                  <h2>{dataSelected[dataIndex].data.title}</h2>
                  <p>{dataSelected[dataIndex].data.description}</p>
                </div>
                <div className="gallery__text__tags__wrapper">
                  {dataSelected[dataIndex].data.techno.map((el, ind) => (
                    <img key={ind} src={`/icons/${el}.png`} />
                  ))}
                </div>
                <div className="gallery__text__links__wrapper">
                  {dataSelected[dataIndex].data.links.git != "" && (
                    <a href={dataSelected[dataIndex].data.links.git}>
                      <img src="/icons/github.png" />
                    </a>
                  )}
                  {dataSelected[dataIndex].data.links.site != "" && (
                    <a href={dataSelected[dataIndex].data.links.site}>
                      <img src="/icons/site.png" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {dataSelected && dataSelected.length > 1 && (
          <div className="gallery__buttons__wrapper">
            <img
              onClick={() => switchWorkHandler("prev")}
              src="/icons/chevron_white.png"
              style={{ transform: "rotate(90deg)" }}
            />
            <img
              onClick={() => switchWorkHandler("next")}
              src="/icons/chevron_white.png"
              style={{ transform: "rotate(-90deg)" }}
            />
          </div>
        )}
      </section>

      {dataSelected && (
        <GalleryDescription
          data={dataSelected[dataIndex].data}
          closing={{ inAnimation, filterSelected }}
        />
      )}
    </main>
  );
}

export default Gallery;
