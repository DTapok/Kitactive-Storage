import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { logout } from '../../actions/authActions.js';

import "./navbar.css"

const Navbar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const token = useSelector(state => state.auth.token);
    const { loading } = useSelector(state => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    // Функция для выхода пользователя
    const logoutUser = async () => {
        await dispatch(logout(token)); // Вызываем action creator для выхода пользователя
        navigate('/');
    }

    return (
        <nav className="navbar">
            {!isAuthenticated && <div ><NavLink className="navbar__link" to="/registration">Регистрация</NavLink></div>}
            {!isAuthenticated && <div ><NavLink className="navbar__link" to="/">Войти</NavLink></div>}
            {isAuthenticated && <div className="navbar__logaut" disabled={loading} onClick={() => logoutUser()}>Выйти</div>}
        </nav>
    )
}

export default Navbar;