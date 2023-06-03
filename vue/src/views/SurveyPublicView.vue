<template>
    <div class="py-5 px-8">
        <div v-if="loading" class="flex justify-center">
            <MoonLoader :loading="true" ></MoonLoader>
        </div>

        <form v-else @submit.prevent="submitSurvey" class="container mx-auto">
            <!-- survey header -->
            <div class="grid grid-cols-6 items-center">
                <div class="mr-4">
                    <img :src="survey.image_url" alt="">
                </div>
                <div class="col-span-5">
                    <h1 class="text-3xl mb-3">{{ survey.title }}</h1>
                    <p class="text-gray-500 text-sm">{{ survey.description }}</p>
                </div>
            </div>

            <!-- survey body (quesion n stuff) -->
            <div v-if="surveyFinished" class="py-8 px-6 bg-emerald-400 text-white w-[600px] mx-auto">
                <div class="text-xl mb-3 font-semibold">
                    Thank you for participating in this survey
                </div>
                <button @click="submitAnotherResponse" type="button" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Submit another response
                </button>
            </div>
            <div v-else>
                <hr class="my-3">
                <div v-for="(question, index) of survey.questions" :key="question.id">
                    <QuestionViewer v-model="answers[question.id]" :question="question" :index="index" />
                </div>

                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Submit
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import QuestionViewer from '../components/viewer/QuestionViewer.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue';

const route = useRoute();
const store = useStore();

const loading = computed(() => store.getters['survey/currentSurveyLoading'])
const survey = computed(() => store.getters['survey/currentSurveyData']);

const surveyFinished = ref(false);
const answers = ref({});

store.dispatch("survey/getSurveyBySlug", route.params.slug);

function submitSurvey() {
    //console.log(JSON.stringify(answers.value, undefined, 2));
    store.dispatch("survey/saveSurveyAnswer", {
        surveyId: survey.value.id,
        answers: answers.value
    })
        .then((res) => {
            if(res.status === 201) {
                surveyFinished.value = true;
            }
        });
}

function submitAnotherResponse() {
    answers.value = {};
    surveyFinished.value = false;
}
</script>

<style>

</style>
