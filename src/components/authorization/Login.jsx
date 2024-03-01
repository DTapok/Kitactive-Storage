import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/authActions.js';
import { useNavigate } from 'react-router-dom';
import './authorization.css'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { loading, error } = useSelector(state => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login(formData));
        // Если авторизация прошла успешно, перенаправляем пользователя на /user
        if (!error) {
            navigate('/user');
        }
    };

    return (
        <div className='authorization'>
            <h2>Войти</h2>
            {error && <div className="error">{error}</div>}
            <form className='authorization_form' onSubmit={handleSubmit}>
                <div className='authorization_form__field'>
                    <label className='authorization_form__field__text'>Email</label>
                    <input className='authorization_form__field__input' type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className='authorization_form__field'>
                    <label className='authorization_form__field__text'>Password</label>
                    <input className='authorization_form__field__input' type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button className='form__btn' type="submit" disabled={loading}>Войти</button>
            </form>
        </div>
    );
};

export default Login;
