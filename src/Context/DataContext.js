import { createContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Utils/firebase-config";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  /* get data on demand */
  const [testimonials, setTestimonials] = useState();

  const getDataHandler = async () => {
    if (testimonials) return;
    try {
      const req = query(
        collection(db, "testimonials"),
        where("msg", "!=", false)
      );
      const res = await getDocs(req);
      const testimonialsCollection = [];
      res.forEach((el) => {
        testimonialsCollection.push({ id: el.id, data: el.data() });
      });
      setTestimonials(testimonialsCollection);
    } catch (err) {
      setTestimonials("error");
      console.log("error getting data", err.message);
    }
  };

  /* select 10 testimonials */
  const [selectedTestimonials, setSelectedTestimonials] = useState();
  const maxTestimonialsSelected = 10;

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    if (!testimonials || testimonials === "error") return;
    if (testimonials.length <= 10) setSelectedTestimonials(testimonials);
    else {
      const index =
        randomIntFromInterval(
          1,
          testimonials.length - maxTestimonialsSelected
        ) - 1;
      setSelectedTestimonials(
        testimonials.slice(index, index + maxTestimonialsSelected)
      );
    }
  }, [testimonials]);

  /* user testimonial */
  const [userTestimonial, setUserTestimonial] = useState();

  const getUserTestimonial = (currentUser) => {
    if (!testimonials || testimonials === "error") return;
    const userMsg = testimonials.find((el) => el.id === currentUser.uid);
    if (userMsg) setUserTestimonial(userMsg);
  };

  const resetUserTestimonial = () => {
    if (!userTestimonial) return;
    setUserTestimonial(false);
  };

  /* create or update message */
  const createUserMsg = async (currentUser, message) => {
    const docRef = doc(db, "testimonials", currentUser.uid);
    await setDoc(docRef, message);
    setUserTestimonial({ id: currentUser.uid, data: message });
    console.log(message);
  };

  const updateUserMsg = async (currentUser, message) => {
    const docRef = doc(db, "testimonials", currentUser.uid);
    await updateDoc(docRef, message);
    setUserTestimonial({ id: currentUser.uid, data: message });
    console.log(message);
  };

  return (
    <DataContext.Provider
      value={{
        testimonials,
        getDataHandler,
        selectedTestimonials,
        userTestimonial,
        getUserTestimonial,
        resetUserTestimonial,
        createUserMsg,
        updateUserMsg,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
