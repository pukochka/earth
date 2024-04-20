<template>
  <q-list>
    <q-item v-for="(count, index) of counts" :key="index">
      <q-item-section side>
        <q-icon :color="count.color" :name="count.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-slider
            :color="count.color"
            :model-value="state.count[count.value]"
            @update:model-value="
              (val) => updateValue(val, count.value, count.action)
            "
            :min="count.min"
            :max="count.max"
          />
        </q-item-label>

        <q-item-label caption>{{ count.label }} </q-item-label>
      </q-item-section>

      <q-item-section side style="min-width: 40px" class="text-weight-bold">
        {{ state.count[count.value] }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { mdiOrbit } from '@quasar/extras/mdi-v7';
import { useState } from 'stores/state/stateStore';

const state = useState();

const updateValue = (
  val: number,
  section: CountNames,
  action?: (val: number) => void
) => {
  state.count[section] = val;

  if (action !== void 0) action(val);
};

const counts = computed<Array<CountItem>>(() => [
  {
    label: 'Количество орбит',
    value: 'orbit',
    icon: mdiOrbit,
    color: 'primary',
    min: 1,
    max: 12,
    action: state.updateOrbits,
  },
  {
    label: 'Количество спутников на орбите',
    value: 'receiver',
    icon: 'satellite_alt',
    color: 'secondary',
    min: 1,
    max: 20,
    action: (val: number) => {
      state.orbits.forEach((item) => item.updateOrbits(val));
    },
  },
]);

type CountNames = 'orbit' | 'receiver';
interface CountItem {
  label: string;
  value: CountNames;
  icon: string;
  color: string;
  min: number;
  max: number;
  action: undefined | ((val: number) => void);
}
</script>

<style scoped></style>
