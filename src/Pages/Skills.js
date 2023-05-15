import React from "react";

function Skills() {
  return (
    <main className="skills__body">
      <section className="skills__filters__wrapper">
        <button>FRONTEND</button>
        <button>BACKEND</button>
        <button>AUTRE</button>
      </section>

      <section className="skills__section skills__front">
        <img />
      </section>
      <section className="skills__section skills__back">
        <img />
      </section>
      <section className="skills__section skills__other">
        <img />
      </section>
    </main>
  );
}

export default Skills;
