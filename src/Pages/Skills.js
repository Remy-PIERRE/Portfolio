import { useState, useEffect, useContext } from "react";
import { GalleryContext } from "../Context/GalleryContext";

function Skills() {
  /* settings */
  const gradient_25 = `linear-gradient(
    to right, #b22929 25%, grey 25% 100%`;
  const gradient_50 = `linear-gradient(
    to right, #b22929 50%, grey 50% 100%`;
  const gradient_75 = `linear-gradient(
    to right, #b22929 75%, grey 75% 100%`;

  /* get data from json thanks to context */
  const { skillsData, getSkillsData } = useContext(GalleryContext);

  useEffect(() => {
    if (skillsData) return;
    getSkillsData();
  }, []);

  /* filters handle */
  const [selectedFilter, setSelectedFilter] = useState();

  useEffect(() => {
    if (!skillsData) return;
    setSelectedFilter("HTML");
  }, [skillsData]);

  const selectionFilterHandler = (filter) => {
    if (filter === selectedFilter) return;
    setSelectedFilter(filter);
  };

  /* get desciption of selected filter from json */
  const [description, setDescription] = useState();

  useEffect(() => {
    if (!selectedFilter) return;
    const desc = skillsData.filter(
      (elem) =>
        elem.filters.filter((el) => el.name === selectedFilter).length != 0
    );
    setDescription(
      desc[0].filters.find((el) => el.name === selectedFilter).description
    );
  }, [selectedFilter]);

  /* filters jsx */
  let filters = false;
  if (skillsData && !["error", "void"].includes(skillsData)) {
    filters = skillsData.map((elem, ind) => {
      return (
        <div key={ind} className="skills__filterCategory__wrapper flexColCC">
          <div className="skills__filterCategory__title outlet__box">
            <h3>{elem.name}</h3>
          </div>
          <div className="skills__filterCategory__filters flexColCC">
            {elem.filters.map((el, ind) => {
              return (
                <div
                  key={ind}
                  className="skills__filter"
                  onClick={() => selectionFilterHandler(el.name)}
                >
                  <p
                    className={`pointer ${
                      selectedFilter === el.name ? "active" : null
                    }`}
                  >
                    {el.name}
                  </p>
                  <div
                    className="skills__filter__jauge"
                    style={{
                      background: `linear-gradient(to right,  #b22929 ${el.gradient}%, grey ${el.gradient}% 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }

  return (
    <main className="skills__body flexColCC">
      <h1 className="skills__title  page__title outlet__box goldenBorder">
        Compétences
      </h1>

      <p
        style={{ fontSize: "1.6rem", marginBottom: "32px", maxWidth: "400px" }}
      >
        Sélectionnez une catégorie pour avoir plus de détails.
      </p>

      <div className="skills__section__wrapper flexColCC">
        <section className="skills__filters__wrapper outlet__box flexColCC goldenBorder">
          {filters ? filters : <p>Problème lors du chargement des données.</p>}
        </section>

        {selectedFilter && (
          <section className="skills__resume__body outlet__box flexColCC goldenBorder">
            <h2>{selectedFilter}</h2>
            <p>{description}</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default Skills;
