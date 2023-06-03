<template>
  <PageComponent>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Surveys</h1>
        <router-link :to="{ name: 'SurveyCreate' }"
          class="py-2 px-3 text-white bg-emerald-500 rounded-md hover:bg-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4 -mt-1 inline-block">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>


          Add new Survey
        </router-link>
      </div>
    </template>
    <div v-if="surveys.loading" class="flex h-[70vh] items-center justify-center mt-5">
      <MoonLoader :loading="true"></MoonLoader>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <SurveyListItem  v-for="(survey, index) in surveys.data" :key="survey.id" :survey="survey" @delete="deleteSurvey(survey)" class="opacity-0 animate-fade-in-down" :style="{ animationDelay: `${index * 0.1}s` }" />
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-5">
        <nav class="relative z-0 inline-flex justify-center rounded-md shadow-sm" aria-label="Pagination">
          <a v-for="(link, index) of surveys.links" :key="index" :disabled="!link.url" v-html="link.label" href="#" @click="getForPage($event, link)" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap"
          :class="[
            link.active ?
              'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' :
              'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            index === 0 ? 'rounded-l-md' : '',
            index === surveys.links.length - 1 ? 'rounded-r-md' : '',
          ]"></a>
        </nav>
      </div>
    </div>
    <!-- <pre>{{ surveys.links }}</pre> -->
  </PageComponent>
</template>

<script setup>
import PageComponent from '../components/PageComponent.vue';
import SurveyListItem from '../components/SurveyListItem.vue';
import MoonLoader from 'vue-spinner/src/MoonLoader.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const surveys = computed(() => store.getters['survey/getSurveys']);

store.dispatch('survey/getAllSurvey');

function deleteSurvey(survey) {
  if( confirm('Are you sure you want to delete this survey?') ) {
    store.dispatch('survey/deleteSurvey', survey.id)
      .then(() => {
        store.dispatch('survey/getAllSurvey');
      })
  }
}

function getForPage(ev, link) {
  ev.preventDefault();
  if(!link.url || link.active) {
    return;
  }

  store.dispatch("survey/getAllSurvey", { url: link.url });
}
</script>

<style></style>
