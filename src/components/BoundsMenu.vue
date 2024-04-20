<template>
  <q-list class="non-selectable">
    <!--    <q-item dense tag="label">-->
    <!--      <q-item-section side>-->
    <!--        <q-toggle-->
    <!--          v-model="state.visibleReceive"-->
    <!--          color="primary"-->
    <!--          @update:model-value="updateSources"-->
    <!--        />-->
    <!--      </q-item-section>-->

    <!--      <q-item-section>-->
    <!--        <q-item-label> Показывать направление приёма</q-item-label>-->
    <!--      </q-item-section>-->
    <!--    </q-item>-->

    <q-item dense tag="label">
      <q-item-section side>
        <q-toggle
          v-model="visibleSource"
          color="primary"
          @update:model-value="updateCity"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label> Показывать название городов </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-for="(bound, index) of bounds" :key="index">
      <q-item-section side>
        <q-icon :color="bound.color" :name="bound.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label caption>{{ bound.label }} </q-item-label>

        <q-item-label>
          <q-slider
            :color="bound.color"
            :model-value="state.bounds[bound.value]"
            :min="bound.min"
            :max="bound.max"
            :step="bound.step"
            @update:model-value="(val) => updateBounds(val, bound.value)"
          />
        </q-item-label>
      </q-item-section>

      <q-item-section
        side
        style="min-width: 90px"
        class="text-weight-bold text-body1"
      >
        {{ state.bounds[bound.value] }} {{ bound.dimension }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  mdiAngleAcute,
  mdiArrowExpandVertical,
  mdiCircleOutline,
} from '@quasar/extras/mdi-v7';
import { useState } from 'stores/state/stateStore';
import { orbitGroup } from 'src/three';

const state = useState();

const visibleSource = ref(true);

const updateSources = () => {
  state.sources.forEach((item) => item.updateLinked());
};

const updateCity = (value: boolean) => {
  const el = document.getElementById('label-renderer');

  if (el) {
    el.style.opacity = value ? '1' : '0';
  }
};

const updateBounds = (val: number, section: BoundsNames) => {
  state.bounds[section] = val;

  if (section === 'offset') {
    orbitGroup.rotation.x = orbitGroup.rotation.y = (val * Math.PI) / 180;
  }

  state.updateOrbits();
};

const bounds = computed(
  (): Array<BoundsData> => [
    {
      label: 'Высота орбиты',
      icon: mdiArrowExpandVertical,
      value: 'orbit',
      color: 'warning',
      dimension: 'km',
      min: 400,
      max: 1500,
      step: 100,
    },
    {
      label: 'Радиус зоны радиовидимости',
      icon: mdiCircleOutline,
      value: 'zone',
      color: 'positive',
      dimension: 'km',
      min: 500,
      max: 1500,
      step: 100,
    },
    {
      label: 'Наклонение орбит',
      icon: mdiCircleOutline,
      value: 'offset',
      color: 'secondary',
      dimension: '°',
      min: -180,
      max: 180,
      step: 10,
    },
    {
      label: 'Угол между МКА в БСГ',
      icon: mdiAngleAcute,
      value: 'degreeReceiver',
      color: 'primary',
      dimension: '°',
      min: 1,
      max: 10,
      step: 1,
    },
    {
      label: 'Угол между орбитами',
      icon: mdiAngleAcute,
      value: 'degreeOrbit',
      color: 'warning',
      dimension: '°',
      min: 1,
      max: 10,
      step: 1,
    },
  ]
);

type BoundsNames =
  | 'orbit'
  | 'zone'
  | 'offset'
  | 'degreeOrbit'
  | 'degreeReceiver';
type BoundsNames1 = 'power' | 'distance' | 'receiver';
interface BoundsData {
  label: string;
  icon: string;
  value: BoundsNames;
  color: string;
  dimension: string;
  min: number;
  max: number;
  step: number;
}

interface BoundsData1 {
  label: string;
  icon: string;
  value: BoundsNames1;
  color: string;
  dimension: string;
  min: number;
  max: number;
  step: number;
}
</script>

<style scoped></style>
