import axiosClient from "../axios";

const survey = {
    namespaced: true,
    state: {
        currentSurvey: {
            loading: false,
            data: {},
        },
        surveys: {
            loading: false,
            links: [],
            data: [],
        },
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
        snackbar: {
            show: false,
            type: null,
            message: null,
        },
    },
    actions: {
        getAllSurvey({ commit }, { url = null } = {}) {
            // check if url is falsy value (undefined), append '/survey'.
            // otherwise, append url itself
            url = url || '/survey'
            commit('setAllSurveyLoading', true);
            return axiosClient.get(url).then((res) => {
                commit('setAllSurveyLoading', false);
                commit('setSurveys', res.data);
                return res;
            })
        },

        getSurvey({ commit }, id) {
            commit("setCurrentSurveyLoading", true);
            return axiosClient.get(`/survey/${id}`)
                .then((res) => {
                    commit("setCurrentSurvey", res.data);
                    commit("setCurrentSurveyLoading", false);
                    return res;
                })
                .catch((err) => {
                    commit("setCurrentSurveyLoading", false);
                    throw err;
                });
        },

        saveSurvey({ commit }, survey) {
            delete survey.image_url;
            let response;
            // update sruvey
            if(survey.id) {
                response = axiosClient
                    .put(`/survey/${survey.id}`, survey)
                    .then((res) => {
                        commit("setCurrentSurvey", res.data);
                        return res;
                    });

            // create survey
            } else {
                response = axiosClient.post('/survey', survey)
                    .then((res) => {
                        commit("setCurrentSurvey", res.data);
                        commit("setSurveys", res.data);
                        return res;
                    });
            }

            return response;
        },

        deleteSurvey({ commit }, id) {
            return axiosClient.delete(`/survey/${id}`)
        },

        // survey public page
        getSurveyBySlug({ commit }, slug) {
            commit("setCurrentSurveyLoading", true);
            return axiosClient
                .get(`/survey-by-slug/${slug}`)
                .then((res) => {
                    commit("setCurrentSurvey", res.data);
                    commit("setCurrentSurveyLoading", false);
                    return res;
                })
                .catch((err) => {
                    commit("setCurrentSurveyLoading", false);
                    throw err;
                });
        },

        saveSurveyAnswer({ commit }, { surveyId, answers }) {
            return axiosClient.post(`/survey/${surveyId}/answer`, { answers });
        },
    },
    getters: {
        currentSurveyLoading: (state) => {
            return state.currentSurvey.loading;
        },

        currentSurveyData: (state) => {
            return state.currentSurvey.data;
        },

        getSurveys: (state) => {
            return state.surveys;
        },

        getQuestionTypes: (state) => {
            return state.questionTypes;
        },

        getSnackbar: (state) => {
            return state.snackbar;
        }
    },
    mutations: {
        // others
        setCurrentSurveyLoading: (state, isLoading) => {
            state.currentSurvey.loading = isLoading;
        },

        setAllSurveyLoading: (state, isLoading) => {
            state.surveys.loading = isLoading;
        },
        showSnackbar: (state, {message, type}) => {
            state.snackbar.show = true;
            state.snackbar.message = message;
            state.snackbar.type = type;

            setTimeout(() => {
                state.snackbar.show = false;
            }, 3000);
        },
        closeSnackbar: (state, isClose) => {
            state.snackbar.show = isClose;
        },

        // survey
        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data;
        },

        setSurveys: (state, surveys) => {
            state.surveys.links = surveys.meta.links;
            state.surveys.data = surveys.data;
        },
    },
};

export default survey;
