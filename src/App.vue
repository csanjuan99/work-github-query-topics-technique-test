<template>
  <div class="h-screen w-full grid grid-cols-1 xl:grid-cols-2 gap-12 p-10">
    <article class="bg-neutral-100 rounded-lg w-full h-full overflow-y-auto">
      <form class="p-4" @submit.prevent="search">
        <header class="p-4 flex justify-between items-center gap-12">
          <h1 class="text-2xl font-bold text-neutral-800 text-center">
            Busqueda en Github
          </h1>
          <button
            type="submit"
            class="bg-white uppercase font-bold px-5 py-3 rounded-lg inline-block hover:bg-neutral-200 ease-in-out transition-all duration-200"
          >
            Buscar
          </button>
        </header>
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
          <p class="text-center text-neutral-800 text-2xl">No hay resultados</p>
        </section>
      </Transition>
    </article>
    <article>
      <h1 v-if="!data" class="text-3xl">
        No hay suficientes resultados para graficar
      </h1>
      <section v-else>
        <h1 class="text-3xl mb-5">Grafica de estrellas</h1>
        <doughnut-component
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </section>
    </article>
  </div>
</template>

<script setup>
// Importar componente de barra de busqueda
import SearchBarComponent from "./components/SearchBarComponent.vue";
// Importar componente de lista de repositorios
import RepositoryListComponent from "./components/RepositoryListComponent.vue";
// Importar componente de grafica de dona
import DoughnutComponent from "./components/DoughnutComponent.vue";
// Importar fragmentos de las consultas de GraphQL
import { SEARCH_REPOS } from "@/graphql/documents";
// Importar dependecias de Apollo y Vue
import { reactive, ref, watch } from "vue";
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

// Variable reactiva que se pasa como prop al grafico de dona para mostrar los datos una vez la consulta se realiza
let chartData = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: [],
    },
  ],
});

// Variable fija que se pasa como prop al grafico de dona para configurar la grafica
let chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// Evento que se dispara al hacer click en el boton de busqueda
async function search() {
  if (searchOptions.query !== "") {
    // Se ejecuta la peticion de busqueda de repositorios a traves de useQuery
    const { onResult } = await useQuery(SEARCH_REPOS, {
      query: `
      ${searchOptions.query}
      stars:>${searchOptions.stars}
      `,
      limit: searchOptions.limit,
    });
    // Con el hook onResult se obtiene la respuesta de la peticion
    onResult((queryResult) => {
      const { search } = queryResult.data;
      data.value = search.edges;
    });
  }
}

// Watcher que se utiliza para insertar de forma dinamica los datos de la respuesta de la peticion en la grafica
watch(
  () => data.value,
  (newValue) => {
    if (newValue) {
      chartData.value.labels = newValue.map((item) => item.node.name);
      chartData.value.datasets[0].data = newValue.map(
        (item) => item.node.stargazers.totalCount
      );
    }
  }
);
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
