import { useState, useEffect, useRef, useContext } from "react";
import { ToggleLoadingContext } from "../Context/ToggleLoadingContext";

function Loading() {
  const { isOpen, isReady, toggleIsReady } = useContext(ToggleLoadingContext);

  const animation = isOpen
    ? "loadingAnimOpening 1.5s forwards "
    : "loadingAnimClosing 1.5s forwards ";

  /* get end animation then send isReady */
  const loadingPanelRef = useRef();
  useEffect(() => {
    if (!loadingPanelRef.current || isReady) return;
    const listenerHandler = () => {
      toggleIsReady(true);
    };
    loadingPanelRef.current.addEventListener("animationend", listenerHandler);
    return () =>
      loadingPanelRef.current.removeEventListener(
        "animationend",
        listenerHandler
      );
  }, [isReady]);

  /* first loading */
  const [firstLoading, setFirstLoading] = useState(true);

  useEffect(() => {
    if (!firstLoading || isOpen) return;
    setFirstLoading(false);
  }, [isOpen]);

  return (
    <section
      ref={loadingPanelRef}
      className={`loading__body flexRowCC ${
        firstLoading ? "firstLoading" : null
      }`}
      style={{
        animation: firstLoading ? null : animation,
      }}
    >
      <div
        key={isOpen}
        className="loading__text__wrapper"
        style={{
          animation:
            isOpen && isReady
              ? "loadingTextFadeAnim 1s forwards"
              : !isOpen && !isReady
              ? "loadingTextFadeAnim 1s forwards reverse"
              : null,
        }}
      >
        {["C", "H", "A", "R", "G", "E", "M", "E", "N", "T", ".", ".", "."].map(
          (el, ind) => (
            <p
              key={ind}
              style={{
                animation: `loadingTextAnim 1.3s infinite ${ind * 0.1}s`,
              }}
            >
              {el}
            </p>
          )
        )}
        {/* <p>C</p>
        <p>H</p>
        <p>A</p>
        <p>R</p>
        <p>G</p>
        <p>E</p>
        <p>M</p>
        <p>E</p>
        <p>N</p>
        <p>T</p>
        <p>.</p>
        <p>.</p>
        <p>.</p> */}
      </div>
    </section>
  );
}

export default Loading;
