<template>
  <doughnut
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script setup>
// Importar dependecias de ChartJs para su funcionamiento
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

// Definiendo props necesarias para la creación del gráfico recibiendo la data desde el padre y
// asignando valores por defecto
const props = defineProps({
  chartId: {
    type: String,
    default: "doughnut-chart",
  },
  datasetIdKey: {
    type: String,
    default: "label",
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  cssClasses: {
    default: "",
    type: String,
  },
  styles: {
    type: Object,
    default: () => {},
  },
  plugins: {
    type: Array,
    default: () => [],
  },
  chartOptions: {
    type: Object,
    default: () => {},
  },
  chartData: {
    type: Object,
    default: () => {},
  },
});

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>
