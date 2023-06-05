import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

function Contact() {
  /* input and text area handle */
  const [inputsValues, setInputsValues] = useState({
    name: "",
    email: "",
    purpose: "",
    msg: "",
  });
  const [inputsValid, setInputsValid] = useState({
    name: false,
    email: false,
    purpose: false,
    msg: false,
  });

  const changeInputValueHandler = (event) => {
    const value = event.target.value;
    const values = { ...inputsValues };
    values[event.target.name] = value;
    setInputsValues(values);
  };

  /* set each input .valid if test ok, .invalid else */
  const nameRegex = /^[a-zA-Z\u00C0-\u00FF0-9s ]{3,18}$/;
  const msgRegex = /.*<[^<]*>.*/;
  const emailReg = /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;

  useEffect(() => {
    const valids = { ...inputsValid };
    for (const [key, value] of Object.entries(inputsValues)) {
      switch (key) {
        case "name":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] = nameRegex.test(value) ? "valid" : "invalid";
          }
          break;
        case "email":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] = emailReg.test(value) ? "valid" : "invalid";
          }
          break;
        case "purpose":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] =
              !msgRegex.test(value) && value.length < 50 ? "valid" : "invalid";
          }
          break;
        case "msg":
          if (value === "") {
            valids[key] = false;
          } else {
            valids[key] =
              !msgRegex.test(value) && value.length < 500 ? "valid" : "invalid";
          }
          break;
      }
    }
    setInputsValid(valids);
  }, [inputsValues]);

  /* submit and send email if ok */
  const contactFormRef = useRef();
  const [emailSend, setEmailSend] = useState();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!contactFormRef) return;

    for (const [key, value] of Object.entries(inputsValid)) {
      if ([false, "invalid"].includes(value)) {
        const errInputs = { ...errorInputAnim };
        errInputs[key] = true;
        setErrorInputAnim(errInputs);
        if (value === false)
          return setErrorMsg("Toutes les catégories doivent être complétées.");
        if (key === "name")
          return setErrorMsg(
            "3 à 18 caractères et pas de caractère spécial requis pour le nom."
          );
        if (key === "email")
          return setErrorMsg("Le format de l'e-mail n'est pas valide.");
        if (key === "purpose")
          return setErrorMsg("50 caractères maximum pour l'objet du message.");
        if (key === "msg")
          return setErrorMsg("500 caractères maximum pour l'objet du message.");
      }
    }

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        contactFormRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          setEmailSend("Votre message à bien été envoyé.");
          setInputsValues({
            name: "",
            email: "",
            purpose: "",
            msg: "",
          });
        },
        (error) => {
          setErrorMsg(
            "Une erreur est surevenue lors de l'envoie de votre message. Veuillez réessayé ultérierement."
          );
        }
      );
  };

  /* error handling */
  const [errorMsg, setErrorMsg] = useState();
  const [errorInputAnim, setErrorInputAnim] = useState({
    name: false,
    email: false,
    purpose: false,
    msg: false,
  });

  useEffect(() => {
    if (!errorMsg && !emailSend) return;
    setTimeout(() => {
      setErrorMsg(false);
      setEmailSend(false);
      setErrorInputAnim({
        name: false,
        email: false,
        purpose: false,
        msg: false,
      });
    }, 3000);
  }, [errorMsg, emailSend]);

  return (
    <main className="contact__body  outlet__body flexColCC">
      <h1 className="page__title outlet__box goldenBorder">
        FORMULAIRE DE CONTACT
      </h1>
      <div
        className={`contact__text__wrapper outlet__box goldenBorder flexColCC ${
          errorMsg ? "error" : emailSend ? "emailSend" : null
        }`}
      >
        {errorMsg ? (
          <p>{errorMsg}</p>
        ) : emailSend ? (
          <p>{emailSend}</p>
        ) : (
          <>
            <p>Vous pouvez me contacter depuis ce formulaire.</p>
            <p>Je vous répondrai le plus rapidement possible.</p>
          </>
        )}
      </div>
      <section className="contact__section__wrapper flexColCC">
        <form
          className="contact__form outlet__box goldenBorder"
          ref={contactFormRef}
        >
          <div className="contact__input__wrapper flexColSpaceBetween">
            <label
              className={inputsValues["name"] ? "gotValue" : null}
              htmlFor="name"
            >
              Votre nom
            </label>
            <input
              name="name"
              onChange={changeInputValueHandler}
              value={inputsValues["name"]}
              className={
                inputsValid["name"]
                  ? inputsValid["name"] === "valid"
                    ? "valid"
                    : "invalid"
                  : null
              }
              style={{
                animation: errorInputAnim["name"]
                  ? "errorInputAnim 1s infinite "
                  : null,
              }}
            />
          </div>
          <div className="contact__input__wrapper">
            <label
              htmlFor="email"
              className={inputsValues["email"] ? "gotValue" : null}
            >
              Votre e-mail
            </label>
            <input
              name="email"
              onChange={changeInputValueHandler}
              value={inputsValues["email"]}
              className={
                inputsValid["email"]
                  ? inputsValid["email"] === "valid"
                    ? "valid"
                    : "invalid"
                  : null
              }
              style={{
                animation: errorInputAnim["email"]
                  ? "errorInputAnim 1s infinite "
                  : null,
              }}
            />
          </div>
          <div className="contact__input__wrapper">
            <label
              htmlFor="purpose"
              className={inputsValues["purpose"] ? "gotValue" : null}
            >
              L'objet de votre message
            </label>
            <input
              name="purpose"
              onChange={changeInputValueHandler}
              value={inputsValues["purpose"]}
              className={
                inputsValid["purpose"]
                  ? inputsValid["purpose"] === "valid"
                    ? "valid"
                    : "invalid"
                  : null
              }
              style={{
                animation: errorInputAnim["purpose"]
                  ? "errorInputAnim 1s infinite "
                  : null,
              }}
            />
          </div>
          <div className="contact__input__wrapper">
            <label
              htmlFor="msg"
              className={inputsValues["msg"] ? "gotValue" : null}
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
        <div className="contact_imgAndButtons__wrapper flexColCC">
          <div className="contact__form__img__wrapper outlet__box goldenBorder">
            <img src="/images/mario_reading_letter.png" />
          </div>
          <div className="contact__submit__wrapper flexRowSpaceBetween">
            <button
              className="simple__button"
              onClick={() =>
                setInputsValues({
                  name: "",
                  email: "",
                  purpose: "",
                  msg: "",
                })
              }
            >
              <img src="/icons/reset.png" />
            </button>

            <button className="simple__button" onClick={submitHandler}>
              <img src="/icons/check.png" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
