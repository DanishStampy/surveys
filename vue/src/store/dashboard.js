import axiosClient from "../axios";

const dashboard = {
    namespaced: true,
    state: {
        survey: {
            loading: false,
            data: {}
        },
    },
    actions: {
        getDashboardData({ commit }) {
            commit('setDashboardLoading', true);
            return axiosClient.get('/dashboard')
                .then((res) => {
                    commit('setDashboardLoading', false);
                    commit('setDashboardData', res.data);
                    return res;
                })
                .catch((err) => {
                    commit('setDashboardLoading', false);
                    return err;
                });
        }
    },
    getters: {},
    mutations: {
        // dashboard
        setDashboardLoading: (state, isLoading) => {
            state.survey.loading = isLoading;
        },

        setDashboardData: (state, data) => {
            state.survey.data = data;
        },
    },
};

export default dashboard;
