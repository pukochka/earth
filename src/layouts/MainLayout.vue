<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-dark">
      <header-actions></header-actions>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import HeaderActions from 'layouts/HeaderActions.vue';
import { useQuasar } from 'quasar';

const quasar = useQuasar();

quasar.dark.set(true);
</script>
