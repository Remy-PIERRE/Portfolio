import { useState, useEffect, useRef, useContext } from "react";
import { ToggleLoadingContext } from "../Context/ToggleLoadingContext";

function Loading() {
  const { isOpen, isReady, toggleIsReady } = useContext(ToggleLoadingContext);

  const animation = isOpen
    ? "loadingAnimOpening 1s forwards"
    : "loadingAnimClosing 1s forwards";

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
      className={`loading__body ${firstLoading ? "firstLoading" : null}`}
      style={{
        animation: firstLoading ? null : animation,
      }}
    ></section>
  );
}

export default Loading;
