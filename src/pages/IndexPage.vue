<template>
  <q-page class="overflow-hidden">
    <div id="earth-scene" class="absolute-full"></div>

    <info-menu></info-menu>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { renderer } from 'src/three';
import InfoMenu from 'components/InfoMenu.vue';

onMounted(() => {
  document.getElementById('earth-scene')!.appendChild(renderer.domElement);
});
</script>
