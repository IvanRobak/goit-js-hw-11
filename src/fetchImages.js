import axios from 'axios';
import { inputEl } from '.';

const BASE_URL = 'https://pixabay.com/api/?key=';
const API_KEY = '34435487-eab0e2257440b4c081b42144c';

let limit = 40;

export const fetchImages = async page => {
  try {
    const response = await axios.get(`${BASE_URL}${API_KEY}`, {
      params: {
        q: `${inputEl.value}`,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: 'true',
        per_page: limit,
        page: page,
      },
    });
    return response.data.hits;
  } catch (error) {
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
};
