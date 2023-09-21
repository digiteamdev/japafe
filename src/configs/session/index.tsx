import Cookies from 'js-cookie';

export const token = (data: any) => {
    Cookies.set('token', data.session.acces_token);
    Cookies.set('role', JSON.stringify(data.role));
    Cookies.set('username', data.username);
    Cookies.set('id', data.employee.id);
    Cookies.set('position', data.employee.position);
    Cookies.set('id_user', data.id);
}

export const getToken = () => {
    let token = Cookies.get('token');
    return token
}

export const getRole = () => {
    let role = Cookies.get('role');
    return role
}

export const getUsername = () => {
    let username = Cookies.get('username');
    return username
}

export const getPosition = () => {
    let position = Cookies.get('position');
    return position
}

export const getId = () => {
    let id = Cookies.get('id');
    return id
}

export const getIdUser = () => {
    let id = Cookies.get('id_user');
    return id
}

export const removeToken = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('username');
    Cookies.remove('id');
    Cookies.remove('id_user');
    Cookies.remove('position');
}