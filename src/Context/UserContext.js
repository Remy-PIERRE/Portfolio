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

  const signUp = async (email, psw) => {
    try {
      await createUserWithEmailAndPassword(auth, email, psw);
    } catch (err) {
      return logErrorHandler(err.code);
    }
  };

  const logIn = async (email, psw) => {
    try {
      await signInWithEmailAndPassword(auth, email, psw);
    } catch (err) {
      return logErrorHandler(err.code);
    }
  };

  const logErrorHandler = (code) => {
    switch (code) {
      case "auth/wrong-password":
        return "Mot de passe incorrecte";
      case "auth/user-not-found":
        return "E-mail invalide.";
      case "auth/email-already-in-use":
        return "Utilisateur déjà existant.";
      default:
        return "La connexion à échouée.";
    }
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
