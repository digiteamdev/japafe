import Cookies from 'js-cookie';

export const token = (data: any) => {
    Cookies.set('token', data.session.acces_token);
    Cookies.set('role', JSON.stringify(data.role));
    Cookies.set('username', data.username);
    Cookies.set('id', data.employee.id);
}

export const getToken = () => {
    let token = Cookies.get('token');
    return token
}

export const getUsername = () => {
    let username = Cookies.get('username');
    return username
}

export const getId = () => {
    let id = Cookies.get('id');
    return id
}

export const removeToken = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('username');
    Cookies.remove('id');
}