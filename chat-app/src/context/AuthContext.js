import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  //check whether we have a user or not
  useEffect(() => {
    //auth function will tell whether the user logged in or not
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); //if user logged in, set up the user in context
      console.log(user);
    });

    //while listening on live events, you should use a cleanup function
    return () => {
      unsub();
    };
  }, []);

  //{children} will be our whole application components
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
