import React from "react";

function Contact() {
  return (
    <main className="contact__body">
      <div className="contact__title__wrapper">
        <h1>FORMULAIRE DE CONTACT</h1>
        <p>Vous pouvez me contacter depuis ce formulaire.</p>
        <p>Je vous répondrais le plus rapidement possible.</p>
      </div>
      <section className="contact__section__wrapper">
        <form className="contact__form">
          <div className="contact__input__wrapper">
            <label htmlFor="name">Votre nom :</label>
            <input name="name" />
          </div>
          <div className="contact__input__wrapper">
            <label htmlFor="email">Votre e-mail :</label>
            <input name="email" />
          </div>
          <div className="contact__input__wrapper">
            <label htmlFor="purpose">La raison de votre message :</label>
            <input name="purpose" />
          </div>
          <div className="contact__input__wrapper">
            <label htmlFor="msg">Votre message :</label>
            <textarea name="msg" />
          </div>
        </form>
        <div className="contact__form__img__wrapper">
          <img />
        </div>
        <div className="contact__submit__wrapper">
          <img src="/images/voyant_reset.png" />
          <img src="/images/voyant_confirm.png" />
        </div>
      </section>
    </main>
  );
}

export default Contact;
