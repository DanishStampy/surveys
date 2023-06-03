import { createStore } from "vuex";
import auth from './auth';
import survey from './survey';
import dashboard from "./dashboard";

const store = createStore({
    modules: {
        auth: auth,
        survey: survey,
        dashboard: dashboard
    },
});

export default store;
