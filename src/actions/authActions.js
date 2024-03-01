import axios from 'axios';

// Запрос на авторизацию
export const login = (userData) => async (dispatch) => {
    try {
        dispatch({ type: 'LOGIN_REQUEST' });
        const response = await axios.post('https://js-test.kitactive.ru/api/login', userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: { error: error.message } });
    }
};

// Запрос на регистрацию
export const register = (userData) => async (dispatch) => {
    try {
        console.log(userData)
        dispatch({ type: 'REGISTER_REQUEST' });
        const response = await axios.post('https://js-test.kitactive.ru/api/register', userData);
        dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'REGISTER_FAILURE', payload: { error: error.message } });
    }
};

// Запрос на выход
export const logout = (token) => async (dispatch) => {
    try {
        dispatch({ type: 'LOGOUT_REQUEST' });
        await axios.post('https://js-test.kitactive.ru/api/logout', null, {
            headers: {
                'Authorization': `Bearer ${token}` // Передаем токен в заголовке запроса
            }
        });
        dispatch({ type: 'LOGOUT_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'LOGOUT_FAILURE', payload: { error: error.message } });
    }
};
