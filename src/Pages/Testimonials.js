import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../Context/UserContext";
import { DataContext } from "../Context/DataContext";
import TestimonialsCaroussel from "../Components/TestimonialsCaroussel";

function Testimonials() {
  /* get selection of testimonials */
  const {
    testimonials,
    getDataHandler,
    selectedTestimonials,
    userTestimonial,
    getUserTestimonial,
    resetUserTestimonial,
    createUserMsg,
    updateUserMsg,
  } = useContext(DataContext);

  useEffect(() => {
    getDataHandler();
  }, []);

  /* get message from user if exists */
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) return;
    else getUserTestimonial(currentUser);
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

  /* msgModal form handle */
  const msgModalFormRef = useRef();
  const msgModalInputsRef = useRef([]);

  const msgModalFormResetHandler = () => {
    if (!msgModalFormRef.current) return;
    msgModalFormRef.current.reset();
  };

  /* regex */
  const userRegex = /^[a-zA-Z\u00C0-\u00FF0-9s ]{3,18}$/;
  const msgRegex = /.*<[^<]*>.*/;
  const [msgModalErrorMsg, setMsgModalErrorMsg] = useState();

  /* error message handle */
  useEffect(() => {
    if (!msgModalErrorMsg) return;
    setTimeout(() => {
      setMsgModalErrorMsg(false);
    }, 2000);
  }, [msgModalErrorMsg]);

  const msgModalSubmitHandler = () => {
    if (!msgModalInputsRef.current.user || !msgModalInputsRef.current.msg)
      return;
    if (userTestimonial && msgModalInputsRef.current.user.value === "")
      msgModalInputsRef.current.user.value = userTestimonial.data.user;
    if (userTestimonial && msgModalInputsRef.current.msg.value === "")
      msgModalInputsRef.current.msg.value = userTestimonial.data.msg;
    if (
      (!userTestimonial && msgModalInputsRef.current.user.value === "") ||
      !userRegex.test(msgModalInputsRef.current.user.value)
    )
      return setMsgModalErrorMsg("Erreur lors de la saisie du nom.");
    if (
      (!userTestimonial && msgModalInputsRef.current.msg.value === "") ||
      msgRegex.test(msgModalInputsRef.current.msg.value) ||
      msgModalInputsRef.current.msg.value.length > 100
    )
      return setMsgModalErrorMsg("Erreur lors de la saisie du message.");

    /* handle values */
    const message = {};
    if (
      !userTestimonial ||
      !["", userTestimonial.data.user].includes(
        msgModalInputsRef.current.user.value
      )
    )
      message["user"] = msgModalInputsRef.current.user.value;
    if (
      !userTestimonial ||
      !["", userTestimonial.data.msg].includes(
        msgModalInputsRef.current.msg.value
      )
    )
      message["msg"] = msgModalInputsRef.current.msg.value;

    if (userTestimonial && (message.user || message.msg))
      updateUserMsg(currentUser, message);
    else if (message["user"] && message["msg"])
      createUserMsg(currentUser, message);

    openMsgModalHandler();
  };

  // if (userTestimonial) console.log(userTestimonial);

  return (
    <main className="testimonials__body">
      <h1 className="testimonials__title">LIVRE D'OR</h1>

      <section className="testimonials__section">
        <div className="testimonials__msg__wrapper">
          {!currentUser && <p>Connectez vous pour me laisser un message.</p>}
          {currentUser && (
            <p>Vous pouvez me laisser un message ou le modifier.</p>
          )}
        </div>

        <div className="testimonials__status__wrapper">
          <div className="testimonials__status">
            <div>
              <p>Statue :</p>
              {!currentUser && <p>Non connecté</p>}
              {currentUser && <p>Connecté</p>}
            </div>
            <img src={`/images/voyant_${currentUser ? "vert" : "rouge"}.png`} />
          </div>
          <div className="testimonials__status">
            <div>
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
          <button onClick={currentUser ? openMsgModalHandler : null}>
            Message
          </button>
        </div>

        <div
          ref={msgModalRef}
          style={{ animation: !msgModalIsReady ? msgModalAnim : null }}
          className={`msgModal ${
            msgModalIsReady ? (msgModalIsOpen ? "isOpen" : "isClose") : null
          }`}
        >
          <img
            onClick={openMsgModalHandler}
            src="/images/chevron.png"
            style={{ transform: "rotate(180deg)" }}
            className="msgModal__closeButton"
          />
          <h3 className="msgModal__title">REDIGER UN MESSAGE</h3>
          <p className="msgModal__error">{msgModalErrorMsg}</p>
          <form ref={msgModalFormRef} className="msgModal__form">
            <div className="msgModal__form__input__wrapper">
              <label htmlFor="user">Votre nom :</label>
              <input
                name="user"
                ref={(el) => (msgModalInputsRef.current["user"] = el)}
                placeholder={userTestimonial ? userTestimonial.data.user : null}
              />
            </div>
            <div className="msgModal__form__input__wrapper">
              <label htmlFor="msg">Votre message :</label>
              <textarea
                name="msg"
                ref={(el) => (msgModalInputsRef.current["msg"] = el)}
                placeholder={userTestimonial ? userTestimonial.data.msg : null}
              />
            </div>
          </form>
          <div className="msgModal__submit__wrapper">
            <img
              src="/images/voyant_reset.png"
              onClick={msgModalFormResetHandler}
            />
            <img
              src="/images/voyant_confirm.png"
              onClick={msgModalSubmitHandler}
            />
          </div>
        </div>
      </section>

      {selectedTestimonials && (
        <TestimonialsCaroussel selectedTestimonials={selectedTestimonials} />
      )}
    </main>
  );
}

export default Testimonials;
