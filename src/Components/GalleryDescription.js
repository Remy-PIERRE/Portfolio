import { useState, useEffect, useRef } from "react";

function GalleryDescription({ data, closing }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inAnimation, setInAnimation] = useState(false);

  const collapseRef = useRef();

  const isOpenHandler = () => {
    if (inAnimation) return;
    setIsOpen((prevState) => !prevState);
    setInAnimation(true);
  };

  useEffect(() => {
    if (!inAnimation || !collapseRef.current) return;
    const listenerHandler = () => {
      setInAnimation(false);
    };
    collapseRef.current.addEventListener("transitionend", listenerHandler);
    return () => {
      if (collapseRef)
        collapseRef.current.removeEventListener(
          "transitionend",
          listenerHandler
        );
    };
  }, [inAnimation]);

  useEffect(() => {
    setIsOpen(false);
  }, [closing]);

  const [index, setIndex] = useState(0);

  const prevImage = () => {
    setIndex((prevState) =>
      prevState === 0 ? data.imgs.length - 1 : prevState - 1
    );
  };

  const nextImage = () => {
    setIndex((prevState) =>
      prevState === data.imgs.length - 1 ? 0 : prevState + 1
    );
  };

  return (
    <section className="gallery__desc__body">
      <div className="gallery__desc__button__wrapper">
        <div>
          <button
            className={`${!data && "unactive"} ${isOpen ? "right" : "left"}`}
            onClick={data && isOpenHandler}
          >
            DETAILS
          </button>
        </div>
      </div>

      {data && (
        <div
          ref={collapseRef}
          className={`gallery__desc__screen ${isOpen ? "open" : null}`}
        >
          <div className="gallery__desc__screen__border">
            <div className="gallery__desc__img__wrapper">
              <img src={`images/${data.imgs[index]}.png`} />
            </div>
            <div className="gallery__desc__text__wrapper">
              <p>{data.desc2}</p>
            </div>
          </div>
          {data.imgs.length > 1 && (
            <div className="gallery__desc__indexButton__wrapper">
              <img
                onClick={prevImage}
                src="/images/chevron.png"
                style={{ transform: "rotate(90deg)" }}
              />
              <img
                onClick={nextImage}
                src="/images/chevron.png"
                style={{ transform: "rotate(-90deg)" }}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default GalleryDescription;
