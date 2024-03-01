const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token') || null, // Проверяем наличие токена в localStorage при инициализации
    loading: false,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
        case 'REGISTER_REQUEST':
        case 'LOGOUT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            localStorage.setItem('token', action.payload.token); // Сохраняем токен в localStorage
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
        case 'LOGOUT_FAILURE':
            localStorage.removeItem('token'); // Удаляем токен из localStorage при ошибке авторизации
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: action.payload.error
            };
        case 'LOGOUT_SUCCESS':
            localStorage.removeItem('token'); // Удаляем токен из localStorage при выходе пользователя
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false
            };
        default:
            return state;
    }
};

export default authReducer;
