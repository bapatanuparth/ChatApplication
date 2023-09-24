import React, { useState } from "react";
import Add from "../images/addAvatar.png";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate(); //to navigate to any page

  const handleSubmit = async (e) => {
    e.preventDefault();

    //take input from register page of 4 different input terms
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    console.log(e.target[3].files[0]);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password); //create user in firebase and return the user object

      const storageRef = ref(storage, displayName); //reference to the storage with user name

      await uploadBytesResumable(storageRef, file).then(() => {
        //upload user img
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateProfile(res.user, {
            //once got the user img url, update the user profile
            //add photo to firebase
            displayName,
            photoURL: downloadURL,
          });
          console.log("File reached");
          await setDoc(doc(db, "users", res.user.uid), {
            //create a users database
            //add the user data to a separate db apart from auth db
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "UserChats", res.user.uid), {}); //create another collection of user chats
          navigate("/"); //once logged in, navigate to home page
          console.log("File available at", downloadURL);
        });
      });
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Parth Chat</span>
          <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="display name" />
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <input style={{ display: "none" }} type="file" id="file" />
            <label htmlFor="file">
              <img src={Add} alt="" />
              <span>Add an avatar</span>
            </label>
            <button>sign up</button>
            {err && <span>Something went wrong</span>}
          </form>
          <p>
            Do you already have account?<Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
