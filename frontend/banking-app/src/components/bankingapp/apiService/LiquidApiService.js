import { apiClient } from './apiClient';

export const liquidDepositApi = (id, amount) => {
    return apiClient.put(`/api/accounts/${id}/liquid/deposit`, { amount });
}


export const liquidWithdrawApi = (id, amount) => {
      return apiClient.put(`/api/accounts/${id}/liquid/withdraw`, { amount });
}
