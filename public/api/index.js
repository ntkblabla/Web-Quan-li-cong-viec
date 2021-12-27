import { getCookie } from '../module/checkAuth.js';

const api = async ({ url, method, body }) => {
  const baseUrl = 'http://localhost:8010/api/v1/';
  const header = {
    method: method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const token = getCookie('auth');
  if (token) {
    header.headers.Authorization = token;
  }
  if (method === 'POST' || method === 'PUT') {
    header.body = JSON.stringify(body);
  }
  const response = await fetch(baseUrl + url, header);
  if (Number(response.status) === 401 || Number(response.status) === 403) {
    window.location.href = '/login';
  }
  return response.json();
};

export default api;
