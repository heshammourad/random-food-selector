/* eslint-disable import/prefer-default-export */

import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.error(error.toString());
    return Promise.reject(error);
  },
);

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
    return false;
  }
};

export const getData = async (path) => {
  try {
    const { data } = await instance.get(path);
    return data;
  } catch (err) {
    return null;
  }
};

export const postData = async (path, body) => {
  try {
    const { data } = await instance.post(path, body);
    return data;
  } catch (err) {
    return null;
  }
};
