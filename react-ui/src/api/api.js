/* eslint-disable import/prefer-default-export */

import axios from 'axios';

const u = localStorage.getItem('username');
const p = localStorage.getItem('password');

const instance = axios.create({
  baseURL: '/api',
});

if (u && p) {
  instance.defaults.auth.username = u;
  instance.defaults.auth.password = p;
}

export const login = async (username, password) => {
  try {
    await instance.get('/login', { auth: { username, password } });

    instance.defaults.auth.username = username;
    instance.defaults.auth.password = password;
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    return true;
  } catch (err) {
    return false;
  }
};
