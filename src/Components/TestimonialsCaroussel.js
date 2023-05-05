import { useState, useEffect, useRef } from "react";
import useWindowWidth from "../Hooks/useWindowWidth";
import TestimonialCard from "./TestimonialsCard";

function TestimonialsCaroussel({ selectedTestimonials }) {
  /* settings */
  const windowWidth = useWindowWidth();
  const maxTestimonialsDisplayed =
    selectedTestimonials.length >= 10 ? 10 : selectedTestimonials.length;

  const prevAnim =
    windowWidth < 768
      ? "prevTestimonialsScreenAnim3 1s forwards"
      : windowWidth < 976
      ? "prevTestimonialsScreenAnim4 1s forwards"
      : "prevTestimonialsScreenAnim5 1s forwards";
  const nextAnim =
    windowWidth < 768
      ? "nextTestimonialsScreenAnim3 1s forwards"
      : windowWidth < 976
      ? "nextTestimonialsScreenAnim4 1s forwards"
      : "nextTestimonialsScreenAnim5 1s forwards";

  /* set number of testimonials displayed => number of visible + 2 for prev / next animation */
  const [displayedCardsNumber, setDisplayedCardsNumber] = useState(3);

  useEffect(() => {
    if (windowWidth < 768) {
      if (displayedCardsNumber === 3) return;
      setDisplayedCardsNumber(3);
    }
    if (windowWidth < 976) {
      if (displayedCardsNumber === 4) return;
      setDisplayedCardsNumber(4);
    }
    if (windowWidth >= 976) {
      if (displayedCardsNumber === 5) return;
      setDisplayedCardsNumber(5);
    }
  }, [windowWidth]);

  /* handle animation time */
  const [inAnimation, setInAnimation] = useState(false);
  const testimonialsScreenRef = useRef();

  useEffect(() => {
    if (!inAnimation || !testimonialsScreenRef.current) return;
    const listenerHandler = () => {
      setInAnimation(false);
      if (inAnimation === "prev") {
        setIndexCard((prevState) => {
          return prevState === 0 ? maxTestimonialsDisplayed - 1 : prevState - 1;
        });
      }
      if (inAnimation === "next") {
        setIndexCard((prevState) => {
          return prevState === maxTestimonialsDisplayed - 1 ? 0 : prevState + 1;
        });
      }
    };
    testimonialsScreenRef.current.addEventListener(
      "animationend",
      listenerHandler
    );
    return () => {
      if (!testimonialsScreenRef.current) return;
      testimonialsScreenRef.current.removeEventListener(
        "animationend",
        listenerHandler
      );
    };
  }, [inAnimation]);

  /* handle index card displayed changes */
  const [indexCard, setIndexCard] = useState(0);

  /* display cards */
  const displayedCards = () => {
    const cards = [];
    let index = indexCard;
    let count = 0;

    while (count < displayedCardsNumber) {
      cards.push(
        <TestimonialCard key={index} data={selectedTestimonials[index].data} />
      );
      count += 1;
      index = index === maxTestimonialsDisplayed - 1 ? 0 : index + 1;
    }

    return cards;
  };

  return (
    <section className="testimonials__caroussel__body">
      {!selectedTestimonials && <p>LOADING...</p>}
      {selectedTestimonials === "error" && (
        <p>Erreur lors du chargement des données.</p>
      )}
      {selectedTestimonials != "error" && (
        <div
          ref={testimonialsScreenRef}
          className="testimonials__caroussel__screen"
          style={{
            width:
              windowWidth < 768
                ? "280%"
                : windowWidth < 976
                ? "186.6%"
                : "162.5%",
            animation:
              inAnimation === "prev"
                ? prevAnim
                : inAnimation === "next"
                ? nextAnim
                : null,
          }}
        >
          {displayedCards()}
        </div>
      )}
      {selectedTestimonials.length >= displayedCardsNumber && (
        <div className="testimonials__caroussel__buttons">
          <img
            src="images/chevron.png"
            style={{ transform: "rotate(90deg)" }}
            onClick={() => setInAnimation("prev")}
          />
          <img
            src="images/chevron.png"
            style={{ transform: "rotate(-90deg)" }}
            onClick={() => setInAnimation("next")}
          />
        </div>
      )}
    </section>
  );
}

export default TestimonialsCaroussel;
