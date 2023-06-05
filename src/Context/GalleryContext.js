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

  const [skillsData, setSkillsData] = useState();

  const getSkillsData = async () => {
    try {
      const resp = await fetch("/data/skills.json");
      const data = await resp.json();
      if (data.length === 0) return setSkillsData("void");
      setSkillsData(data);
    } catch (err) {
      console.log("error getting skills data", err.message);
      setSkillsData("error");
    }
  };

  return (
    <GalleryContext.Provider
      value={{ galleryData, getGalleryData, skillsData, getSkillsData }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export { GalleryContext, GalleryProvider };
