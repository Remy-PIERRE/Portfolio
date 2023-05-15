import { useState, useEffect, createContext } from "react";

const GalleryContext = createContext();

const GalleryProvider = ({ children }) => {
  /* get data on demand */
  const [galleryData, setGalleryData] = useState();

  const getGalleryData = async () => {
    try {
      const resp = await fetch("/data/gallery.json");
      const data = await resp.json();
      if (data.length === 0) return setGalleryData("void");
      setGalleryData(data);
    } catch (err) {
      console.log("error getting gallery data", err.message);
      setGalleryData("error");
    }
  };

  return (
    <GalleryContext.Provider value={{ galleryData, getGalleryData }}>
      {children}
    </GalleryContext.Provider>
  );
};

export { GalleryContext, GalleryProvider };
