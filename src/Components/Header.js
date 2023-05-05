import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useWindowWidth from "../Hooks/useWindowWidth";
import { UserContext } from "../Context/UserContext";
import { ToggleLoadingContext } from "../Context/ToggleLoadingContext";
import { DataContext } from "../Context/DataContext";

function Header() {
  /* modals handling */
  const [isOpen, setIsOpen] = useState({
    nav: false,
    log: false,
  });
  const [isReady, setIsReady] = useState({
    nav: true,
    log: true,
  });

  const openCloseHandler = (modal) => {
    if (!isReady[modal]) return;
    const openStates = { ...isOpen };
    openStates[modal] = !openStates[modal];
    setIsOpen(openStates);
    const readyStates = { ...isReady };
    readyStates[modal] = false;
    setIsReady(readyStates);
  };

  /* close resp nav when desk version */
  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (windowWidth > 976 && isOpen["nav"]) {
      setIsOpen({
        nav: false,
        log: false,
      });
    }
  }, [windowWidth]);

  /* resp nav handling */
  const respNavRef = useRef();
  const navAnim =
    windowWidth < 976
      ? isOpen["nav"]
        ? "navAnim 1s forwards"
        : "navAnim 1s forwards reverse"
      : null;

  // useEffect(() => {
  //   if (isReady["nav"] || !respNavRef.current) return;
  //   const listenerHandler = () => {
  //     const readyStates = { ...isReady };
  //     readyStates["nav"] = true;
  //     setIsReady(readyStates);
  //   };
  //   respNavRef.current.addEventListener("animationend", listenerHandler);
  //   return () => {
  //     if (respNavRef.current)
  //       respNavRef.current.removeEventListener("animationend", listenerHandler);
  //   };
  // }, [isReady]);

  /* log modal handling */
  const logModalRef = useRef();
  const logModalAnim = isOpen["log"]
    ? "logModalAnim 1s forwards"
    : "logModalAnim 1s forwards reverse";

  // useEffect(() => {
  //   if (isReady["log"] || !logModalRef.current) return;
  //   const listenerHandler = () => {
  //     const readyStates = { ...isReady };
  //     readyStates["log"] = true;
  //     setIsReady(readyStates);
  //   };
  //   logModalRef.current.addEventListener("animationend", listenerHandler);
  //   return () => {
  //     if (logModalRef.current)
  //       logModalRef.current.removeEventListener(
  //         "animationend",
  //         listenerHandler
  //       );
  //   };
  // }, [isReady]);

  useEffect(() => {
    if (
      (isReady["nav"] && isReady["log"]) ||
      (!logModalRef.current && !respNavRef.current)
    )
      return;
    const listenerHandler = () => {
      setIsReady({
        nav: true,
        log: true,
      });
    };
    if (logModalRef.current)
      logModalRef.current.addEventListener("animationend", listenerHandler);
    if (respNavRef.current)
      respNavRef.current.addEventListener("animationend", listenerHandler);
    return () => {
      if (logModalRef.current)
        logModalRef.current.removeEventListener(
          "animationend",
          listenerHandler
        );
      if (respNavRef.current)
        respNavRef.current.removeEventListener("animationend", listenerHandler);
    };
  }, [isReady]);

  /* log form handle */
  const formRef = useRef();
  const inputsRef = useRef([]);
  const [createOrLogIn, setCreateOrLogIn] = useState("create");

  /* handle error msg */
  const [logErrorMsg, setLogErrorMsg] = useState(false);

  useEffect(() => {
    if (!logErrorMsg) return;
    setTimeout(() => {
      setLogErrorMsg(false);
    }, 2000);
  }, [logErrorMsg]);

  /* regex */
  const emailReg = /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
  const pswReg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /* security and firebase */
  const {
    currentUser,
    signUp,
    logIn,
    signOutHandler: signOut,
  } = useContext(UserContext);

  const submitHandler = () => {
    if (
      inputsRef.current["email"].value === "" ||
      !emailReg.test(inputsRef.current["email"].value)
    )
      setLogErrorMsg("E-mail incorrecte.");
    if (
      inputsRef.current["psw"].value === "" ||
      !pswReg.test(inputsRef.current["psw"].value)
    )
      setLogErrorMsg("Mot de passe incorrecte.");
    if (
      createOrLogIn === "create" &&
      inputsRef.current["psw"].value != inputsRef.current["pswConfirm"].value
    )
      setLogErrorMsg("Les mots de passe doivent correspondre.");

    if (createOrLogIn === "create")
      signUp(inputsRef.current["email"].value, inputsRef.current["psw"].value);

    if (createOrLogIn === "logIn")
      logIn(inputsRef.current["email"].value, inputsRef.current["psw"].value);

    setIsOpen({ nav: false, log: false });
    setIsReady({ nav: false, log: false });
  };

  /* signOut */
  const { resetUserTestimonial } = useContext(DataContext);

  const signOutHandler = () => {
    resetUserTestimonial();
    signOut();
    openCloseHandler("nav");
  };

  /* nav */
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isOpen: isOpenLoading,
    toggleIsOpenLoading,
    isReady: isReadyLoading,
    toggleIsReady,
  } = useContext(ToggleLoadingContext);
  const [direction, setDirection] = useState();

  const navigationHandler = (targetedPage) => {
    if (location.pathname === targetedPage || !isReadyLoading) return;
    toggleIsOpenLoading(true);
    setTimeout(() => {
      if (isOpen["nav"]) openCloseHandler("nav");
      if (isOpen["log"]) openCloseHandler("log");
    }, 1000);
    setDirection(targetedPage);
  };

  /* auto close loading */
  useEffect(() => {
    if (!isReadyLoading || !direction) return;
    navigate(direction);
    setTimeout(() => {
      toggleIsOpenLoading(false);
    }, 500);
  }, [isReadyLoading]);

  return (
    <header className="header__main">
      <div className="header__wrapper">
        <div className="header__logo__wraper">
          <img src="/images/logo-v1.png" />
        </div>

        <div className="header__openNav__resp">
          <button onClick={() => openCloseHandler("nav")}></button>
        </div>

        <nav
          className={`header__nav__wrapper ${
            isReady["nav"] && isOpen["nav"] ? "isOpen" : "isClose"
          }`}
          ref={respNavRef}
          style={{ animation: !isReady["nav"] ? navAnim : null }}
        >
          <div className="header__nav__links__wrapper">
            <div onClick={() => navigationHandler("/")}>ACCUEIL</div>
            <div onClick={() => navigationHandler("/a-propos")}>
              PRESENTATION
            </div>
            <div onClick={() => navigationHandler("/competences")}>
              COMPETENCES
            </div>
            <div onClick={() => navigationHandler("/galerie")}>GALERIE</div>
            <div onClick={() => navigationHandler("/livre-dor")}>
              LIVRE D'OR
            </div>
            <div onClick={() => navigationHandler("contact")}>CONTACT</div>
          </div>

          <div className="header__nav__icons__wrapper">
            {!currentUser && (
              <img
                src={
                  windowWidth > 976
                    ? "/images/user.png"
                    : "/images/user_white.png"
                }
                onClick={() => openCloseHandler("log")}
              />
            )}
            {currentUser && (
              <img
                src={
                  windowWidth > 976
                    ? "/images/power-off.png"
                    : "/images/power-off_white.png"
                }
                onClick={() => signOutHandler()}
              />
            )}
            <img
              src={
                windowWidth > 976
                  ? "/images/pdf-file.png"
                  : "/images/pdf-file_white.png"
              }
            />
          </div>
        </nav>
      </div>

      <section
        className={`header__logModal__wrapper ${
          isReady["log"] && isOpen["log"] ? "isOpen" : "isClose"
        }`}
        ref={logModalRef}
        style={{ animation: !isReady["log"] ? logModalAnim : null }}
      >
        <div
          className="header__logModal__close__wrapper"
          onClick={() => openCloseHandler("log")}
        >
          <img src="/images/cancel.png" />
        </div>

        <div className="header__logModal__headSwitch__wrapper">
          <button
            className={createOrLogIn === "create" ? "active" : null}
            onClick={() => setCreateOrLogIn("create")}
          >
            Créer un compte
          </button>
          <button
            className={createOrLogIn === "logIn" ? "active" : null}
            onClick={() => setCreateOrLogIn("logIn")}
          >
            Se connecter
          </button>
        </div>

        <div className="header__logModal__errorMsh__wrapper">
          <p>{logErrorMsg}</p>
        </div>

        <form className="header__logModal__form" ref={formRef}>
          <div>
            <label htmlFor="email">E-mail :</label>
            <input
              ref={(el) => (inputsRef.current["email"] = el)}
              name="email"
            />
          </div>
          <div>
            <label htmlFor="psw">Mot de passe :</label>
            <input ref={(el) => (inputsRef.current["psw"] = el)} name="psw" />
          </div>
          {createOrLogIn === "create" && (
            <div>
              <label htmlFor="pwsConfirm">Confirmation :</label>
              <input
                ref={(el) => (inputsRef.current["pswConfirm"] = el)}
                name="pswConfirm"
              />
            </div>
          )}
        </form>

        <div className="header__logModal__submit__wrapper">
          <img
            src="/images/reset.png"
            onClick={() => formRef.current.reset()}
          />
          <img src="/images/check.png" onClick={submitHandler} />
        </div>
      </section>
    </header>
  );
}

export default Header;
