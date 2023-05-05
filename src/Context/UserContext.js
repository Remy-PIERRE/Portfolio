import { useState, useEffect, createContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../Utils/firebase-config";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  const signUp = (email, psw) => {
    createUserWithEmailAndPassword(auth, email, psw);
  };

  const logIn = (email, psw) => {
    signInWithEmailAndPassword(auth, email, psw);
  };

  const signOutHandler = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
    });
  });

  // if (currentUser) console.log(currentUser);

  return (
    <UserContext.Provider
      value={{ currentUser, signUp, logIn, signOutHandler }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
