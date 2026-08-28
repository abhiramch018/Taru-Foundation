import axiosClient from "./axiosClient";

export const authApi = {
    register: async (userData) => {
        const response = await axiosClient.post(
            "/api/auth/register",
            userData
        );
        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await axiosClient.post(
            "/api/auth/verify-otp",
            { email, otp }
        );
        return response.data;
    },

    resendOtp: async (email) => {
        const response = await axiosClient.post(
            "/api/auth/resend-otp",
            { email }
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
    },

    // Forgot Password
    forgotPassword: async (email) => {
        const response = await axiosClient.post(
            "/api/auth/forgot-password",
            { email }
        );
        return response.data;
    },

    // Reset Password
    resetPassword: async (token, password) => {
        const response = await axiosClient.post(
            `/api/auth/reset-password/${token}`,
            { password }
        );
        return response.data;
    }
};