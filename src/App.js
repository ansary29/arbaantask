import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Auth/Login";
import AddUser from "./component/Users/AddUser";
import UsersList from "./component/Users/UsersList";
import Register from "./component/Auth/Register";
import EditUser from "./component/Users/EditUser";
import FullView from "./component/Users/FullView";

function App() {
  const [user, setUser] = useState([]);
  const [userAddMsg, setUserAddMsg] = useState("");
  const [userUpdateMsg, setUserUpdateMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const IsLogin = localStorage.getItem("name") !== null;
  // eslint-disable-next-line

  // Search User by input==>

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newUserList = user.filter((users) => {
        return Object.values(users)
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newUserList);
    } else {
      setSearchResults(user);
    }
  };
  // function filter data by gender
  const findUserType = (e) => {
    var newUsers = user;
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      newUsers = newUsers.filter((user) => user.gender === e.target.value);
    }
    setSearchResults(newUsers);
  };

  // Add User Data
  const addUserHandler = async (
    UserName,
    UserEmail,
    UserContact,
    UserGender
  ) => {
    const request = {
      name: UserName,
      email: UserEmail,
      contact: UserContact,
      gender: UserGender,
    };
    await axios.post("https://jsonplaceholder.typicode.com/users", request);
    getAllUser();
    setUserAddMsg("User Added Succesfully");
    window.setTimeout(() => {
      setUserAddMsg("");
    }, 3000);
  };

  // Fetch User Data  ====>
  const retrieveAudience = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    return response.data;
  };
  const getAllUser = async () => {
    const allUser = await retrieveAudience();
    if (allUser) setUser(allUser);
  };

  // Edit User Data
  const editUserHandler = async (
    id,
    UserName,
    UserEmail,
    UserContact,
    UserGender
  ) => {
    const requestEditUser = {
      name: UserName,
      email: UserEmail,
      contact: UserContact,
      gender: UserGender,
    };
    await axios.put(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      requestEditUser
    );
    getAllUser();
    setUserUpdateMsg("User updated Successfully");
    window.setTimeout(() => {
      setUserUpdateMsg("");
    }, 3000);
  };

  // Remove User Data====>
  const removeUserHandler = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    const newUserList = user.filter((curclm) => {
      return curclm.id !== id;
    });
    setUser(newUserList);
  };

  useEffect(() => {
    getAllUser();
  }, []);
  // eslint-disable-next-line

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="register" element={<Register />} />
          <Route
            exact
            path="/users"
            element={
              <UsersList
                term={searchTerm}
                findUserType={findUserType}
                searchKeyword={searchHandler}
                serrchTerm={searchResults}
                user={searchTerm.length < 1 ? user : searchResults}
                userAddMsg={userAddMsg}
                userUpdateMsg={userUpdateMsg}
                getUserId={removeUserHandler}
              />
            }
          />
          <Route
            exact
            path="/addUser"
            element={<AddUser addUserHandler={addUserHandler} />}
          />
          <Route exact path="/users/fullView/:id" element={<FullView />} />
          <Route
            exact
            path="/users/editUser/:id"
            element={<EditUser editUserHandler={editUserHandler} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
