/* eslint-disable import/prefer-default-export */

import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

const token = localStorage.getItem('token');
if (token) {
  const auth = JSON.parse(token);
  instance.defaults.auth = auth;
}

export const login = async (username, password) => {
  try {
    const auth = { username, password };
    await instance.get('/login', { auth });

    instance.defaults.auth = auth;
    localStorage.setItem('token', JSON.stringify(auth));

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.toString());
    return false;
  }
};
