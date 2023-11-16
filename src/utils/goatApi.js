import axios from 'axios';

const goatApi = axios.create({
  baseURL: 'https://ac.cnstrc.com/search'
});

export default goatApi;