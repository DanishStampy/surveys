import axiosClient from "../axios";

const auth = {
    namespaced: true,
    state: {
        user: {
            data: {},
            token: sessionStorage.getItem("TOKEN"),
        },
    },
    getters: {
        getUserData: (state) => {
            return state.user.data;
        }
    },
    actions: {
        register({ commit }, user) {
            return axiosClient.post("/register", user).then(({ data }) => {
                commit("setUser", data);
                return data;
            });
        },

        login({ commit }, user) {
            return axiosClient.post("/login", user).then(({ data }) => {
                commit("setUser", data);
                return data;
            });
        },

        logout({ commit }) {
            return axiosClient.post("/logout").then((response) => {
                commit("logout");
                return response;
            });
        },
    },
    mutations: {
        logout: (state) => {
            state.user.data = {};
            state.user.token = null;
            sessionStorage.removeItem("TOKEN");
        },
        setUser: (state, userData) => {
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem("TOKEN", userData.token);
        },
    }
};

export default auth;
