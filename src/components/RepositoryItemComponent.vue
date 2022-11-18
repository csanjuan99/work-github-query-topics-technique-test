<template>
  <li
      class="flex flex-col justify-between p-5 border-b border-gray-200 bg-white rounded-lg my-3"
  >
    <a target="_blank" :href="item.url">
      <div class="flex flex-col">
        <h3 class="text-lg font-bold">{{ item.name }}</h3>
        <p class="text-gray-500">{{ item.description }}</p>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-center mt-5">
        <div class="flex items-center">
          <img class="w-8 h-8 rounded-full" :src="item.owner.avatarUrl" alt=""/>
          <p class="ml-2 text-gray-500">{{ item.owner.login }}</p>
        </div>
        <div class="flex items-center mt-3 md:mt-0">
          <p class="text-gray-500 mr-2">Stars:</p>
          <p class="text-gray-500">{{ item.stargazers.totalCount }}</p>
        </div>
      </div>
    </a>
  </li>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  repository: {
    type: Object,
    required: true,
  },
});

const item = computed(() => props?.repository?.node);
</script>
