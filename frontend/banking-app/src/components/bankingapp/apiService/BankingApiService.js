import { apiClient } from './apiClient';

export const getAccountsById = (id) => {
    return apiClient.get(`/${id}`);
    };

export const getAllAccountsApi = () => {
  return apiClient.get('');
};

export const addAccountApi = (account) => {
  return apiClient.post('', account);
}

export const depositApi = (id, amount) =>
  apiClient.put(`/${id}/deposit`, { amount });

export const withdrawApi = (id, amount) =>
  apiClient.put(`/${id}/withdraw`, { amount });

export const deleteAccountApi = (id) =>
  apiClient.delete(`/${id}`);