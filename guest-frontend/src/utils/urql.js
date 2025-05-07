import { API_CONFIG } from '../config';
import { createClient, cacheExchange, fetchExchange } from '@urql/core';

export const client = createClient({
  url: `${API_CONFIG.BASE_URL}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = sessionStorage.getItem('jwt');
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});