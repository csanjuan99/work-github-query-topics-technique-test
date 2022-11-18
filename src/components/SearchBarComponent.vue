<template>
  <input
    type="text"
    class="text-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:border-transparent rounded-lg w-full"
    placeholder="'facebook', 'vuejs', 'react', etc..."
    v-model="text"
  />
</template>

<script setup>
// Importar dependencias de Vue
import { computed } from "vue";

// Se define un evenot que luego sera usado para comunicar el componente con el padre
const search = defineEmits(["update:value"]); // Uso de update para two-way binding

// Definicion de props para two-way binding
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});

// Se define una variable reactiva para el texto de la barra de busqueda
const text = computed({
  get: () => props.value,
  set: (value) => {
    // Se emite el evento update:value con el valor de la barra de busqueda
    search("update:value", value);
  },
});
</script>
