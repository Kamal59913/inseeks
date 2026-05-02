import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_EMPERA_BASE_URL}/${
  import.meta.env.VITE_EMPERA_VERSION
}/${import.meta.env.VITE_IMAGE_UPLOAD_URL}`;

const imageApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default imageApiClient;
