import axios from "axios";

export const host = window.REACT_APP_API_HOST;
export const port = window.REACT_APP_API_PORT;

export const trainer_host = window.REACT_APP_TRAINER_HOST;
export const trainer_port = window.REACT_APP_TRAINER_PORT;

export const portal_host = window.REACT_APP_PORTAL_HOST;
export const portal_port = window.REACT_APP_PORTAL_PORT;

console.log(
  "Image Factory listening on:",
  window.REACT_APP_API_HOST + ":" + window.REACT_APP_API_PORT
);
console.log(
  "Designated Trainer:",
  window.REACT_APP_TRAINER_HOST + ":" + window.REACT_APP_TRAINER_PORT
);
console.log(
  "Designated Portal:",
  window.REACT_APP_PORTAL_HOST + ":" + window.REACT_APP_PORTAL_PORT
);

export const axiosRoot = axios.create({
  //API BASE URL
  baseURL: `http://${host}:${port}`,
});

export const axiosUser = axios.create({
  //API BASE URL
  baseURL: `http://${host}:${port}/user`,
});

export const axiosFileManager = axios.create({
  //API BASE URL
  baseURL: `http://${host}:${port}/file_manager`,
});

export const axiosLabel = axios.create({
  baseURL: `http://${host}:${port}/label`,
});

export const axiosDatabase = axios.create({
  baseURL: `http://${host}:${port}/db`,
});
