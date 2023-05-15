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
              !msgRegex.test(value) && value.length < 300 ? "valid" : "invalid";
          }
          break;
      }
    }
    setInputsValid(valids);
  }, [inputsValues]);

  /* submit and send email if ok */
  const contactFormRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!contactFormRef) return;

    for (const [key, value] of Object.entries(inputsValid)) {
      if ([false, "invalid"].includes(value)) {
        const errInputs = { ...errorInputAnim };
        errInputs[key] = true;
        setErrorInputAnim(errInputs);
        let keyName;
        if (key === "name") keyName = "nom";
        if (key === "email") keyName = "e-mail";
        if (key === "purpose") keyName = "objet du message";
        if (key === "msg") keyName = "message";
        return setErrorMsg(`La categorie "${keyName}" doit être completée.`);
      }
    }

    // emailjs
    //   .sendForm(
    //     "service_qi2ah8n",
    //     "template_sxx8fai",
    //     contactFormRef.current,
    //     "rSIEe2PuVw7v8R3SN"
    //   )
    //   .then(
    //     (result) => {
    //       console.log(result.text);
    //     },
    //     (error) => {
    //       console.log(error.text);
    //     }
    //   );
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
    if (!errorMsg) return;
    setTimeout(() => {
      setErrorMsg(false);
      setErrorInputAnim({
        name: false,
        email: false,
        purpose: false,
        msg: false,
      });
    }, 3000);
  }, [errorMsg]);

  return (
    <main className="contact__body  outlet__body">
      <h1>FORMULAIRE DE CONTACT</h1>
      <div className={`contact__text__wrapper ${errorMsg ? "error" : null}`}>
        {errorMsg ? (
          <p>{errorMsg}</p>
        ) : (
          <>
            <p>Vous pouvez me contacter depuis ce formulaire.</p>
            <p>Je vous répondrai le plus rapidement possible.</p>
          </>
        )}
      </div>
      <section className="contact__section__wrapper">
        <form className="contact__form" ref={contactFormRef}>
          <div className="contact__input__wrapper">
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
        <div className="contact_imgAndButtons__wrapper">
          <div className="contact__form__img__wrapper">
            <img src="/images/mario_reading_letter.png" />
          </div>
          <div className="contact__submit__wrapper">
            <button
              onClick={() =>
                setInputsValues({
                  name: "",
                  email: "",
                  purpose: "",
                  msg: "",
                })
              }
            >
              Réinitialiser
            </button>
            <button className="contact__submit__falseButton" />
            <button onClick={submitHandler}>Confirmer</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
