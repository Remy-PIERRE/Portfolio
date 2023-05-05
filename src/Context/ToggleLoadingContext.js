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
    }, 1000);
  }, []);

  return (
    <ToggleLoadingContext.Provider
      value={{
        isOpen,
        toggleIsOpenLoading,
        isReady,
        toggleIsReady,
      }}
    >
      {children}
    </ToggleLoadingContext.Provider>
  );
}

export { ToggleLoadingContext, ToggleLoadingProvider };
