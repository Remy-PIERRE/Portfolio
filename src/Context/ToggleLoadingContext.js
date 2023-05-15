import { createContext, useState, useEffect } from "react";

const ToggleLoadingContext = createContext();

function ToggleLoadingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isReady, setIsReady] = useState(true);

  /* toogle loadingPage isOpen */
  const toggleIsOpenLoading = (newState) => {
    if (isOpen === newState || !isReady) return;
    setIsOpen(newState);
    setIsReady(false);
  };
  /* toogle loadingPage isReady */
  const toggleIsReady = () => {
    setIsReady(true);
  };

  /* first loading */
  useEffect(() => {
    setTimeout(() => {
      toggleIsOpenLoading(false);
    }, 2000);
  }, []);

  /* call change route from ext of header */
  const [changeRouteDemand, setChangeRouteDemand] = useState();
  const changeRouteHandler = (direction) => {
    setChangeRouteDemand(direction);
  };

  return (
    <ToggleLoadingContext.Provider
      value={{
        isOpen,
        toggleIsOpenLoading,
        isReady,
        toggleIsReady,
        changeRouteDemand,
        changeRouteHandler,
      }}
    >
      {children}
    </ToggleLoadingContext.Provider>
  );
}

export { ToggleLoadingContext, ToggleLoadingProvider };
