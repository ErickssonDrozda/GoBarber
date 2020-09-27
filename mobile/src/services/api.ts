import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333',
});

export default api;

// adb reverse tcp:3333 tcp:3333
