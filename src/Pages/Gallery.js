import { useContext, useEffect, useState, useRef } from "react";
import { GalleryContext } from "../Context/GalleryContext";
import Caroussel from "../Components/Caroussel";
import CarousselDetails from "../Components/CarousselDetails";

function Gallery() {
  /* get data from context */
  const { galleryData, getGalleryData } = useContext(GalleryContext);

  useEffect(() => {
    if (!galleryData) getGalleryData();
  }, []);

  /* manage filters */
  const [filterSelected, setFilterSelected] = useState("tous");

  const filterSelectedHandler = (filter) => {
    if (filter === "tous" && filterSelected === "tous") return;
    if (filterSelected === filter) return setFilterSelected("tous");
    setFilterSelected(filter);
  };

  /* manage galleryData according filter selected */
  const [filteredData, setFilteredData] = useState();

  useEffect(() => {
    if (!galleryData) return;
    if (filterSelected === "tous") return setFilteredData(galleryData);
    const newData = galleryData.filter((el) =>
      el.data.filters.includes(filterSelected)
    );
    setFilteredData(newData);
    if (index > newData.length - 1) setIndex(newData.length - 1);
  }, [filterSelected, galleryData]);

  /* manage index */
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState();

  const indexHandler = (direction, timer) => {
    let newIndex;
    if (direction === "prev")
      newIndex = index === 0 ? filteredData.length - 1 : index - 1;
    if (direction === "next")
      newIndex = index === filteredData.length - 1 ? 0 : index + 1;

    setNextIndex({ newIndex, timer, data: filteredData[newIndex].data });

    setTimeout(() => {
      if (direction === "prev") setIndex(newIndex);
      if (direction === "next") setIndex(newIndex);
    }, timer / 2);
  };

  return (
    <main className="gallery__body">
      <h1 className="gallery__title page__title outlet__box goldenBorder">
        GALERIE
      </h1>

      <section className="gallery__filters__wrapper flexRowSpaceBetween outlet__box">
        <button
          onClick={() => filterSelectedHandler("tous")}
          className={`simple__button ${
            filterSelected === "tous" ? "active" : null
          }`}
        >
          TOUS
        </button>
        <button
          onClick={() => filterSelectedHandler("professionnel")}
          className={`simple__button ${
            filterSelected === "professionnel" ? "active" : null
          }`}
        >
          PROFESSIONNEL
        </button>
        <button
          onClick={() => filterSelectedHandler("formation")}
          className={`simple__button ${
            filterSelected === "formation" ? "active" : null
          }`}
        >
          FORMATION
        </button>
      </section>

      <Caroussel
        data={filteredData && filteredData[index].data}
        indexHandler={indexHandler}
      />

      <CarousselDetails
        data={filteredData && filteredData[index].data}
        nextIndex={nextIndex}
      />
    </main>
  );
}

export default Gallery;
