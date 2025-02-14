import axios from "axios";

const AuthService = {
    login: async (data) => {
        try {
            const res = await axios.post("http://localhost:3000/auth/login", data);
            return res.data;
        } catch (e) {
            console.log(e);
        }
    },

    register: async (data) => {
        try {
            console.log(data);
            await axios.post("http://localhost:3000/auth/register", data);
        } catch (e) {
            console.log(e);
        }
    },

    loginWithGoogle: async (tokenId) => {
        try {
            const res = await axios.post("http://localhost:3000/auth/google", { tokenId });
            return res.data;
        } catch (e) {
            console.log(e);
        }
    }
};

export default AuthService;
