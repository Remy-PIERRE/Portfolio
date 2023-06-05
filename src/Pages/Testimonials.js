import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import { DataContext } from "../Context/DataContext";
import TestimonialsCaroussel from "../Components/TestimonialsCaroussel";
import { updateCurrentUser } from "firebase/auth";

function Testimonials() {
  /* get selection of testimonials */
  const {
    getDataHandler,
    selectedTestimonials,
    userTestimonial,
    getUserTestimonial,
    createUserMsg,
    updateUserMsg,
  } = useContext(DataContext);

  useEffect(() => {
    getDataHandler();
  }, []);

  /* get message from user if exists */
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser && msgModalIsOpen) return openMsgModalHandler();
    else if (currentUser) getUserTestimonial(currentUser);
  }, [currentUser]);

  /* msg modal handler */
  const [msgModalIsOpen, setmsgModalIsOpen] = useState(false);
  const [msgModalIsReady, setMsgModalIsReady] = useState(true);
  const msgModalRef = useRef();
  const msgModalAnim = msgModalIsOpen
    ? "msgModalAnim 1s forwards"
    : "msgModalAnim 1s forwards reverse";

  const openMsgModalHandler = () => {
    if (!msgModalIsReady) return;
    setmsgModalIsOpen((prevState) => !prevState);
    setMsgModalIsReady(false);
  };

  useEffect(() => {
    if (msgModalIsReady || !msgModalRef.current) return;
    const listenerHandler = () => {
      setMsgModalIsReady(true);
    };
    msgModalRef.current.addEventListener("animationend", listenerHandler);
    return () => {
      if (msgModalRef.current)
        msgModalRef.current.removeEventListener(
          "animationend",
          listenerHandler
        );
    };
  }, [msgModalIsReady]);

  /* handle form from msg modal */
  /* input and text area handle */
  const [inputsValues, setInputsValues] = useState({
    user: "",
    msg: "",
  });
  const [inputsValid, setInputsValid] = useState({
    user: false,
    msg: false,
  });

  useEffect(() => {
    if (!userTestimonial)
      return setInputsValues({
        user: "",
        msg: "",
      });
    setInputsValues({
      user: userTestimonial.data.user,
      msg: userTestimonial.data.msg,
    });
    setInputsValid({ user: "valid", msg: "valid" });
  }, [userTestimonial]);

  const changeInputValueHandler = (event) => {
    const value = event.target.value;
    const values = { ...inputsValues };
    values[event.target.name] = value;
    setInputsValues(values);
  };

  /* regex */
  const userRegex = /^[a-zA-Z\u00C0-\u00FF0-9s ]{3,18}$/;
  const msgRegex = /.*<[^<]*>.*/;

  useEffect(() => {
    const valids = { ...inputsValid };
    for (const [key, value] of Object.entries(inputsValues)) {
      switch (key) {
        case "user":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] = userRegex.test(value) ? "valid" : "invalid";
          }
          break;
        case "msg":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] =
              !msgRegex.test(value) && value.length < 150 ? "valid" : "invalid";
          }
          break;
      }
    }
    setInputsValid(valids);
  }, [inputsValues, currentUser]);

  /* error handling */
  const [errorMsg, setErrorMsg] = useState();
  const [errorInputAnim, setErrorInputAnim] = useState({
    name: false,
    msg: false,
  });

  useEffect(() => {
    if (!errorMsg) return;
    setTimeout(() => {
      setErrorMsg(false);
      setErrorInputAnim({
        name: false,

        msg: false,
      });
    }, 3000);
  }, [errorMsg]);

  /* error message handle */
  useEffect(() => {
    if (!errorMsg) return;
    setTimeout(() => {
      setErrorMsg(false);
    }, 2000);
  }, [errorMsg]);

  /* msgModal form handle */
  const msgModalFormRef = useRef();

  const msgModalSubmitHandler = (e) => {
    e.preventDefault();
    if (!msgModalFormRef) return;

    for (const [key, value] of Object.entries(inputsValid)) {
      if ([false, "invalid"].includes(value)) {
        const errInputs = { ...errorInputAnim };
        errInputs[key] = true;
        setErrorInputAnim(errInputs);
        let keyName;
        if (key === "user") keyName = "nom";
        if (key === "msg") keyName = "message";
        return setErrorMsg(`La categorie "${keyName}" doit être completée.`);
      }
    }

    /* handle values */
    const newMessage = {};
    if (
      !userTestimonial ||
      !["", userTestimonial.data.user].includes(inputsValues["user"])
    )
      newMessage["user"] = inputsValues["user"];
    if (
      !userTestimonial ||
      !["", userTestimonial.data.msg].includes(inputsValues["msg"])
    )
      newMessage["msg"] = inputsValues["msg"];

    if (userTestimonial && (newMessage.user || newMessage.msg))
      updateUserMsg(currentUser, newMessage);
    else if (newMessage["user"] && newMessage["msg"])
      createUserMsg(currentUser, newMessage);

    setErrorMsg("Merci. Le message sera visible après validation.");
    setTimeout(() => {
      openMsgModalHandler();
    }, 2000);
  };

  return (
    <main className="testimonials__body flexColCC">
      <h1 className="testimonials__title page__title outlet__box goldenBorder">
        LIVRE D'OR
      </h1>

      <section className="testimonials__section outlet__box">
        <div className="testimonials__msg__wrapper outlet__box">
          {!currentUser && <p>Connectez-vous pour me laisser un message.</p>}
          {currentUser && (
            <p>Vous pouvez me laisser un message ou le modifier.</p>
          )}
        </div>

        <div className="testimonials__status__wrapper flexColCC">
          <div className="testimonials__status flexRowSpaceBetween outlet__box">
            <div className="flexColCC">
              <p>Statut :</p>
              {!currentUser && <p>Non connecté</p>}
              {currentUser && <p>Connecté</p>}
            </div>
            <img src={`/images/voyant_${currentUser ? "vert" : "rouge"}.png`} />
          </div>
          <div className="testimonials__status  flexRowSpaceBetween  outlet__box">
            <div className="flexColCC">
              <p>Message :</p>
              {!userTestimonial && <p>Pas de message</p>}
              {userTestimonial && <p>Message enregistré</p>}
            </div>{" "}
            <img
              src={`/images/voyant_${userTestimonial ? "vert" : "rouge"}.png`}
            />
          </div>
        </div>

        <div
          className={`testimonials__editMessage__wrapper ${
            !currentUser ? "invisible" : null
          }`}
        >
          <button
            className="simple__button"
            onClick={currentUser ? openMsgModalHandler : null}
          >
            Message
          </button>
        </div>

        <div
          ref={msgModalRef}
          style={{ animation: !msgModalIsReady ? msgModalAnim : null }}
          className={`msgModal flexColCC ${
            msgModalIsReady ? (msgModalIsOpen ? "isOpen" : "isClose") : null
          }`}
        >
          <button className="msgModal__closeButton simple__button">
            <img
              onClick={openMsgModalHandler}
              src="/icons/arrow-right.png"
              style={{ transform: "rotate(-90deg)" }}
              className="imgCover"
            />
          </button>
          <h3 className="msgModal__title outlet__box goldenBorder page__title">
            REDIGER UN MESSAGE
          </h3>
          <p className="msgModal__error">{errorMsg}</p>
          <form
            ref={msgModalFormRef}
            className="msgModal__form outlet__box goldenBorder"
          >
            <div className="msgModal__form__input__wrapper">
              <label
                className={inputsValues["user"] ? "gotValue" : null}
                htmlFor="user"
              >
                Votre nom
              </label>
              <input
                name="user"
                onChange={changeInputValueHandler}
                value={inputsValues["user"]}
                className={
                  inputsValid["user"]
                    ? inputsValid["user"] === "valid"
                      ? "valid"
                      : "invalid"
                    : null
                }
                style={{
                  animation: errorInputAnim["user"]
                    ? "errorInputAnim 1s infinite "
                    : null,
                }}
              />
            </div>
            <div className="msgModal__form__input__wrapper">
              <label
                className={inputsValues["msg"] ? "gotValue" : null}
                htmlFor="msg"
              >
                Votre message
              </label>
              <textarea
                name="msg"
                onChange={changeInputValueHandler}
                value={inputsValues["msg"]}
                className={
                  inputsValid["msg"]
                    ? inputsValid["msg"] === "valid"
                      ? "valid"
                      : "invalid"
                    : null
                }
                style={{
                  animation: errorInputAnim["msg"]
                    ? "errorInputAnim 1s infinite "
                    : null,
                }}
              />
            </div>
          </form>
          <div className="msgModal__submit__wrapper flexRowSpaceBetween">
            <div className="msgModal__submit__button simple__button">
              <img
                src="/icons/reset.png"
                onClick={() =>
                  userTestimonial
                    ? setInputsValues({
                        user: userTestimonial.data.user,
                        msg: userTestimonial.data.msg,
                      })
                    : setInputsValues({
                        user: "",
                        msg: "",
                      })
                }
              />
            </div>
            <div className="msgModal__submit__button simple__button">
              <img src="/icons/check.png" onClick={msgModalSubmitHandler} />
            </div>
          </div>
        </div>
      </section>

      {selectedTestimonials && selectedTestimonials.length > 0 && (
        <TestimonialsCaroussel selectedTestimonials={selectedTestimonials} />
      )}
    </main>
  );
}

export default Testimonials;
