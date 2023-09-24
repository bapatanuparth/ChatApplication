import React, { useContext, useState } from "react";
import {
  collection,
  getDocs,
  query,
  setDoc,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  //when we search for a user, we change the username value
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    //firebase function to build query
    const q = query(
      collection(db, "users"), //search in users collection as someone is typing
      where("displayName", "==", username) //if we find a username match,
    );
    try {
      const querySnapshot = await getDocs(q); //set User to the matched username on Enter button hit
      querySnapshot.forEach((doc) => {
        setUser(doc.data()); //in our user we have the searched user here
      });
    } catch (error) {
      setErr(error);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group (chats in firestore) exists or not
    //else create new conversation

    console.log("user clicked");
    console.log(user.uid);
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create a new chat between those 2 users.

        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log("in here");
        //create user chats -- in userchats collection, for current user, add new user as a chat
        await updateDoc(doc(db, "UserChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(), //firebase provided timestamp
        });
        //for the new user, add current user as a chat
        //this way both current user, and user that was searched, both have each other's entry in userchats db
        await updateDoc(doc(db, "UserChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a User"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span> Not found</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
