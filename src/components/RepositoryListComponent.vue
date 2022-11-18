<template>
  <ul class="w-full rounded-lg p-5">
    <repository-item-component
      v-for="(repository, index) in props?.data"
      :key="index"
      :repository="repository"
    />
  </ul>
</template>

<script setup>
import RepositoryItemComponent from "./RepositoryItemComponent.vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>
