import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Add from "../images/addAvatar.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate(); //to navigate to any page

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      //firebase provided api for user sign in
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); //to home page if match is there
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Parth Chat</span>
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <button type="submit">sign in</button>
          </form>
          <p>
            You don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
