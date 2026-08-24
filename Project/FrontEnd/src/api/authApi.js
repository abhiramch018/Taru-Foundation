import axiosClient from "./axiosClient";

export const authApi = {
    register: async (userData) => {
        const response = await axiosClient.post(
            "/api/auth/register",
            userData
        );
        return response.data;
    },

    login: async (credentials) => {
        const response = await axiosClient.post(
            "/api/auth/login",
            credentials
        );
        return response.data;
    },

    applySeller: async (sellerData) => {
        const response = await axiosClient.post(
            "/api/auth/apply-seller",
            sellerData
        );
        return response.data;
    },

    getMe: async () => {
        const response = await axiosClient.get("/api/auth/me");
        return response.data;
    }
};