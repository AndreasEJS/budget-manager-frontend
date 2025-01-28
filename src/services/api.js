import axios from 'axios';  

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Dynamisk URL från .env
    headers: {
        'Content-Type': 'application/json'
    },


});

export const fetchCategorySummary = async () => {
    const response = await apiClient.get('/Analytics/CategorySummary');
    return response.data;
};

export const fetchTransactions = async (categoryId) => {
    const url = categoryId ? `/Transaction?categoryId=${categoryId}` : '/Transaction';
    const response = await apiClient.get(url);
    return response.data;
};

export const createTransaction = async (transaction) => {
    const response = await apiClient.post('/Transaction', transaction);
    return response.data;
};
export const fetchDateSummary = async () => {
    const response = await apiClient.get('/Analytics/DateSummary');
    return response.data;
}
export const updateTransaction = async (transaction) => {
    const response = await apiClient.put(`/Transaction/${transaction.id}`, transaction);
    return response.data;
}
export const fetchCategories = async () => {
    const response = await apiClient.get('/Category');
    return response.data;
}

export const deleteTransaction = async (transactionId) => {
    const response = await apiClient.delete(`/Transaction/${transactionId}`);
    return response.data;
};


export { apiClient };

