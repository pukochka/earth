<template>
  <q-scroll-area style="width: 350px; height: 450px" :thumb-style="thumbStyle">
    <q-list dense padding class="rounded" style="max-width: 350px">
      <q-item-label header>БСГ МКА</q-item-label>

      <q-item
        tag="label"
        clickable
        v-for="([key, value], index) of Object.entries(groupingsSatellite)"
        :key="index"
      >
        <q-item-section side>
          <q-radio
            color="primary"
            :val="Number(key)"
            v-model="state.groupings.receiver"
            @update:model-value="state.updateOrbits"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ value }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item-label header>Орбиты</q-item-label>

      <q-item
        tag="label"
        clickable
        v-for="([key, value], index) of Object.entries(groupingsOrbit)"
        :key="index"
      >
        <q-item-section side>
          <q-radio
            color="warning"
            :val="Number(key)"
            v-model="state.groupings.orbit"
            @update:model-value="state.updateOrbits"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ value }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useState } from 'stores/state/stateStore';

const state = useState();

const groupingsSatellite = {
  1: 'Без группировки',
  2: 'По 2 МКА',
  3: 'По 3 МКА',
  4: 'По 4 МКА',
};

const groupingsOrbit = {
  1: 'Без группировки',
  2: 'По 2 орбиты',
  3: 'По 3 орбиты',
  4: 'По 4 орбиты',
};

const thumbStyle = {
  width: '5px',
  margin: '4px',
  background: 'var(--q-primary)',
};
</script>

<style scoped></style>
