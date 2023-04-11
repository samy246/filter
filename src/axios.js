import axios from "axios";

const instance = axios.create({
  baseURL: "https://jtbdev.iksulalive.com",
});

export default instance;
