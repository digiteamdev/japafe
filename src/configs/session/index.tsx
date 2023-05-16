import Cookies from 'js-cookie';

export const token = (data: any) => {
    Cookies.set('token', data.session.acces_token);
    Cookies.set('role', JSON.stringify(data.role));
    Cookies.set('username', data.username);
}

export const getToken = () => {
    let token = Cookies.get('token');
    return token
}

export const removeToken = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('username');
}