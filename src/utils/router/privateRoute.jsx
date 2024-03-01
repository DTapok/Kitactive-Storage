import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
const PrivateRoute = () => {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const location = useLocation(); // получаем текущий маршрут с помощью хука useLocation()

    return (
        // если пользователь авторизован, то рендерим дочерние элементы текущего маршрута, используя компонент Outlet
        isAuthenticated === true ?
            <Outlet />
            // если пользователь не авторизован, то перенаправляем его на маршрут /login с помощью компонента Navigate
            // свойство replace указывает, что текущий маршрут будет заменен на новый, чтобы пользователь не мог вернуться
            // обратно, используя кнопку "назад" в браузере.
            :
            <Navigate to="/" state={{ from: location }} replace />
    );
}

export default PrivateRoute;