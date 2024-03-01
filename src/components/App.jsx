import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from '../components/authorization/Login.jsx';
import Registration from '../components/authorization/Registration.jsx';
import UserDashboard from '../components/userDashboard/UserDashboard.jsx';
import Navbar from '../components/navbar/Navbar.jsx';
import PrivateRoute from '../utils/router/privateRoute.jsx';

import './App.css'

function App() {

  return (

    <Router>
      <Navbar />
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route element={<PrivateRoute />}>
            <Route path='/user' element={<UserDashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
