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

  /* log modal handling */
  const logModalRef = useRef();
  const logModalAnim = isOpen["log"]
    ? "logModalAnim 1s forwards"
    : "logModalAnim 1s forwards reverse";

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
  const [inputsValue, setInputsValue] = useState({
    email: "",
    psw: "",
    pswConfirm: "",
  });
  const [inputsValid, setInputsValid] = useState({
    email: false,
    psw: false,
    pswConfirm: false,
  });
  const [createOrLogIn, setCreateOrLogIn] = useState("create");

  /* handle error msg */
  const [logErrorMsg, setLogErrorMsg] = useState(false);

  useEffect(() => {
    if (!logErrorMsg) return;
    setTimeout(() => {
      setLogErrorMsg(false);
    }, 3000);
  }, [logErrorMsg]);

  const changeInputValueHandler = (event) => {
    const value = event.target.value;
    const values = { ...inputsValue };
    values[event.target.name] = value;
    setInputsValue(values);
  };

  /* regex */
  const emailReg = /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
  const pswReg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const valids = { ...inputsValid };
    for (const [key, value] of Object.entries(inputsValue)) {
      switch (key) {
        case "email":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] = emailReg.test(value) ? "valid" : "invalid";
          }
          break;
        case "psw":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] = pswReg.test(value) ? "valid" : "invalid";
          }
          break;
        case "pswConfirm":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] = value === inputsValue["psw"] ? "valid" : "invalid";
          }
          break;
      }
    }
    setInputsValid(valids);
  }, [inputsValue]);

  /* security and firebase */
  const {
    currentUser,
    signUp,
    logIn,
    signOutHandler: signOut,
  } = useContext(UserContext);

  const submitHandler = async () => {
    if (inputsValid["email"] != "valid")
      return setLogErrorMsg("E-mail incorrecte.");
    if (inputsValid["psw"] != "valid")
      return setLogErrorMsg("Mot de passe incorrecte.");
    if (createOrLogIn === "create" && inputsValid["pswConfirm"] != "valid")
      return setLogErrorMsg("Les mots de passe doivent correspondre.");

    let errorMsg;
    if (createOrLogIn === "create")
      errorMsg = await signUp(inputsValue["email"], inputsValue["psw"]);
    if (createOrLogIn === "logIn")
      errorMsg = await logIn(inputsValue["email"], inputsValue["psw"]);
    if (errorMsg) return setLogErrorMsg(errorMsg);
    else {
      setIsOpen({ nav: false, log: false });
      setIsReady({ nav: false, log: false });
    }
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
    changeRouteDemand,
    changeRouteHandler,
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

  useEffect(() => {
    if (!changeRouteDemand) return;
    navigationHandler(changeRouteDemand);
    changeRouteHandler(false);
  }, [changeRouteDemand]);

  /* auto close loading */
  useEffect(() => {
    if (!isReadyLoading || !direction) return;
    navigate(direction);
    setTimeout(() => {
      toggleIsOpenLoading(false);
    }, 2000);
  }, [isReadyLoading]);

  return (
    <header className="header__main">
      <div className="header__wrapper">
        <div className="header__logo__wraper">
          <img src="/images/logo_remdev.png" />
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
        <div className="header__logModal__background" />

        <div
          className="header__logModal__close__wrapper"
          onClick={() => openCloseHandler("log")}
        >
          <img
            src="/icons/arrow-right.png"
            style={{ transform: "rotate(180deg)" }}
          />
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

        <form className="header__logModal__form" ref={formRef}>
          <div className="header__logModal__errorMsh__wrapper">
            <p>{logErrorMsg}</p>
          </div>

          <div>
            <label
              className={inputsValue["email"] ? "gotValue" : null}
              htmlFor="email"
            >
              E-mail :
            </label>
            <input
              name="email"
              onChange={changeInputValueHandler}
              value={inputsValue["email"]}
              className={
                inputsValid["email"]
                  ? inputsValid["email"] === "valid"
                    ? "valid"
                    : "invalid"
                  : null
              }
            />
          </div>
          <div>
            <label
              className={inputsValue["psw"] ? "gotValue" : null}
              htmlFor="psw"
            >
              Mot de passe :
            </label>
            <input
              name="psw"
              onChange={changeInputValueHandler}
              value={inputsValue["psw"]}
              className={
                inputsValid["psw"]
                  ? inputsValid["psw"] === "valid"
                    ? "valid"
                    : "invalid"
                  : null
              }
            />
          </div>
          {createOrLogIn === "create" && (
            <div>
              <label
                className={inputsValue["pswConfirm"] ? "gotValue" : null}
                htmlFor="pswConfirm"
              >
                Confirmation :
              </label>
              <input
                name="pswConfirm"
                onChange={changeInputValueHandler}
                value={inputsValue["pswConfirm"]}
                className={
                  inputsValid["pswConfirm"]
                    ? inputsValid["pswConfirm"] === "valid"
                      ? "valid"
                      : "invalid"
                    : null
                }
              />
            </div>
          )}
        </form>

        <div className="header__logModal__submit__wrapper">
          <img
            src="/images/reset.png"
            onClick={() =>
              setInputsValue({
                email: "",
                psw: "",
                pswConfirm: "",
              })
            }
          />
          <img src="/images/check.png" onClick={submitHandler} />
        </div>
      </section>
    </header>
  );
}

export default Header;
