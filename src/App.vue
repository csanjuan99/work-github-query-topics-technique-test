<template>
  <div class="h-screen w-full flex flex-col justify-center items-center p-10">
    <article
      class="bg-neutral-100 rounded-lg w-[1000px] h-fit overflow-y-auto"
    >
      <header class="p-4 flex justify-between items-center gap-12">
        <h1 class="text-2xl font-bold text-neutral-800 text-center">
          Busqueda en Github
        </h1>
        <button
          class="bg-white uppercase font-bold px-5 py-3 rounded-lg inline-block hover:bg-neutral-200 ease-in-out transition-all duration-200"
          @click="search"
        >
          Buscar
        </button>
      </header>
      <form class="p-4" @submit.prevent="search">
        <search-bar-component
          required
          :value="searchOptions.query"
          @update:value="(newValue) => (searchOptions.query = newValue)"
        />
        <section class="flex flex-col mt-5">
          <label for="stars">Estrellas mínimas</label>
          <input
            id="stars"
            type="number"
            placeholder="Estrellas minimas"
            min="0"
            class="text-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-transparent rounded-lg"
            v-model="searchOptions.stars"
          />
        </section>
        <section class="flex flex-col mt-5">
          <label for="stars">Limite de resultados</label>
          <input
            id="limit"
            type="number"
            placeholder="Limite de resultados"
            min="1"
            class="text-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-transparent rounded-lg"
            v-model="searchOptions.limit"
          />
        </section>
      </form>
      <Transition name="fade">
        <section class="w-full" v-if="data">
          <repository-list-component :data="data" />
        </section>
        <section v-else class="my-5">
          <p class="text-center text-neutral-800">No hay resultados</p>
        </section>
      </Transition>
    </article>
  </div>
</template>

<script setup>
// Importar componente de barra de busqueda
import SearchBarComponent from "./components/SearchBarComponent.vue";
// Importar componente de lista de repositorios
import RepositoryListComponent from "./components/RepositoryListComponent.vue";
// Importar fragmentos de las consultas de GraphQL
import { SEARCH_REPOS } from "@/graphql/documents";
// Importar dependecias de Apollo y Vue
import { reactive, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useApollo } from "@/composables/useApollo";

// Inyectar el cliente de Apollo
useApollo();

// Configuramos las variables reactivas del componente usadas para la busquedac en la peticion
const searchOptions = reactive({
  query: "",
  limit: 10,
  stars: 0,
});

// Variable reactiva que guarda la respuesta de la peticion
const data = ref(null);

// Evento que se dispara al hacer click en el boton de busqueda
async function search() {
  if (searchOptions.query) {
    // Se ejecuta la peticion de busqueda de repositorios
    const { onResult } = await useQuery(SEARCH_REPOS, {
      query: `
      ${searchOptions.query}
      stars:>${searchOptions.stars}
      `,
      limit: searchOptions.limit,
    });
    onResult((queryResult) => {
      const { search } = queryResult.data;
      data.value = search.edges;
    });
  }
}
</script>

<style scoped>
/* Declarar la clase para la transicion de tipo fade*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

/* Declarar la clase para la transicion de tipo fade*/
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
