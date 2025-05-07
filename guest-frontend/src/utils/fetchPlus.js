import { API_CONFIG } from '../config';

const fetchPlus = async (url, method, headers, body) => {
  return new Promise(async(resolve, reject) => {
    let options = {
      method: method,
      headers: headers,
      body: JSON.stringify(body) || ''
    }
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${url}`, options)
      if (res.ok) {
        const data = await res.json();
        resolve(data);
      }
      else{
        throw new Error(`Response status: ${res.status}`);
      }
    } catch (error) {
      reject(error);
    }
  })
}

export default fetchPlus;