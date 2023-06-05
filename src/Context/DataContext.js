import { createContext, useState, useEffect, useContext } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Utils/firebase-config";
import { UserContext } from "./UserContext";

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
        if (el.data().auth === true)
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
  const { currentUser } = useContext(UserContext);

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

  useEffect(() => {
    if (!currentUser) return setUserTestimonial(false);
    getUserTestimonial(currentUser);
  }, [currentUser, testimonials]);

  /* create or update message */
  const createUserMsg = async (currentUser, message) => {
    try {
      const docRef = doc(db, "testimonials", currentUser.uid);
      await setDoc(docRef, {
        ...message,
        timestamp: serverTimestamp(),
        auth: false,
      });
      setUserTestimonial({ id: currentUser.uid, data: message });
    } catch (err) {
      console.log("err", err.code);
    }
    getUserTestimonial(currentUser);
  };

  const updateUserMsg = async (currentUser, message) => {
    try {
      const docRef = doc(db, "testimonials", currentUser.uid);
      await updateDoc(docRef, {
        ...message,
        timestamp: serverTimestamp(),
        auth: false,
      });
      setUserTestimonial({ id: currentUser.uid, data: message });
    } catch (err) {
      console.log("err", err.code);
    }
    getUserTestimonial(currentUser);
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
