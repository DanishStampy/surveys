import { createStore } from "vuex";
import axiosClient from "../axios";

const tmpSurveys = [
    {
        id: 100,
        title: "Whos the best?",
        slug: "whos-the-best?",
        status: "draft",
        image: "https://cdn.shopify.com/s/files/1/2531/6758/articles/tree_nuts_3_1024x1024.jpg?v=1611863316",
        description: "Pistachio vs Almond",
        created_at: "2023-01-01 18:00:00",
        updated_at: "2023-01-01 18:00:00",
        expired_at: "2023-01-01 18:00:00",
        questions: [
            {
                id: 1,
                type: "select",
                question: "From which country are you?",
                description: null,
                data: {
                    options: [
                        {
                            uuid: "f8af96f2-1d80-4632-9e9e-b560670e52ea",
                            text: "USA",
                        },
                        {
                            uuid: "201c1ff5-23c9-42f9-bfb5-bbc850536440",
                            text: "Georgia",
                        },
                        {
                            uuid: "b5c09733-a49e-460a-ba8a-526863010729",
                            text: "Germany",
                        },
                    ],
                },
            },
            {
                id: 2,
                type: "checkbox",
                question: "Which PHP framework cool?",
                description: "PHPHPHPPPPP",
                data: {
                    options: [
                        {
                            uuid: "f8af96f2-1d13212312e-b560670e52ea",
                            text: "Laravel",
                        },
                        { uuid: "201c1ff5-sdgasd-bbc850536440", text: "Yii2" },
                        {
                            uuid: "b5c09733-a2234fdawsgf863010729",
                            text: "Symfony",
                        },
                    ],
                },
            },
            {
                id: 3,
                type: "radio",
                question: "Which Laravel framework u love?",
                description: "Laravellll",
                data: {
                    options: [
                        {
                            uuid: "31132230-29e0-4857-84ed-417542c7c8dd",
                            text: "Laravel 5",
                        },
                        {
                            uuid: "0ab85f86-15ee-4ec0-ba42-793daf243a5d",
                            text: "Laravel 6",
                        },
                        {
                            uuid: "748fd679-d983-4d73-8d7b-7bb4abd22254",
                            text: "Laravel 7",
                        },
                    ],
                },
            },
            {
                id: 4,
                type: "text",
                question: "What's your favourite YouTube channel?",
                description: null,
                data: {},
            },
            {
                id: 5,
                type: "textarea",
                question: "What do you think about me?",
                description: "Write your honest answer",
                data: {},
            },
        ],
    },
    {
        id: 300,
        title: "Vue 3",
        slug: "vue-3",
        status: "active",
        image: "https://hips.hearstapps.com/hmg-prod/images/group-of-nuts-as-background-royalty-free-image-1664917655.jpg",
        description: `Vue (pronounced /vju:/, like view) is a progressive framework for building us`,
        created_at: "2021-12-21 17:00:00",
        updated_at: "2021-12-21 17:00:00",
        expire_date: "2021-12-31 00:00:00",
        questions: [],
    },
];

const store = createStore({
    state: {
        user: {
            data: {},
            token: sessionStorage.getItem("TOKEN"),
        },
        surveys: [...tmpSurveys],
    },
    getters: {},
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
    },
    modules: {},
});

export default store;
