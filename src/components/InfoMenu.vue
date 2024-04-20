<template>
  <transition
    :name="
      state.info ? 'q-transition--slide-left' : 'q-transition--slide-right'
    "
  >
    <q-list
      bordered
      class="rounded overflow-hidden absolute-top-right q-ma-md bg-dark z-max text-weight-bold"
      style="width: 400px"
      v-if="state.info"
    >
      <q-item-label header class="text-center q-py-sm">Сведения</q-item-label>

      <q-item dense v-for="(item, index) of info" :key="index">
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>

        <q-item-section side :class="['text-' + item.color]">
          <q-item-label>{{ item.value }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item-label header class="text-center q-py-sm">
        В зоне обзора
      </q-item-label>

      <q-item dense>
        <q-item-section class="text-white">
          <q-item-label>Номер КА</q-item-label>
        </q-item-section>

        <q-item-section class="text-center" v-if="state.method === 1">
          <q-item-label>Задержка</q-item-label>
        </q-item-section>

        <q-item-section class="text-center" v-if="state.method === 0">
          <q-item-label>Пеленг</q-item-label>
        </q-item-section>
      </q-item>

      <q-item dense v-if="!links.length">
        <q-item-section class="text-center text-warning">
          <q-item-label>Источник не в зоне обзора</q-item-label>
        </q-item-section>
      </q-item>

      <q-item dense v-for="(link, index) of links" :key="index">
        <q-item-section>
          <q-item-label>{{ index + 1 }}</q-item-label>
        </q-item-section>

        <q-item-section class="text-center" v-if="state.method === 0">
          <q-item-label class="text-info">
            {{ getAngle(link.worldReceiver, link.worldSource) }}°
          </q-item-label>
        </q-item-section>

        <q-item-section class="text-center" v-if="state.method === 1">
          <q-item-label class="text-info">
            {{ getDistance(link.worldReceiver, link.worldSource) }} нс
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator v-if="calculating.length === 2" />

      <q-list dense v-if="calculating.length === 2">
        <q-item-label header class="text-center q-py-sm">
          Рассчитанные координаты
        </q-item-label>

        <q-item>
          <q-item-section>
            <q-item-label> Широта </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label> {{ coords.lat.toFixed(5) }}° </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label> Долгота </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label> {{ coords.lon.toFixed(5) }}° </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label> Отклонение от истинного </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label> {{ deviation }} км </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-list>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useState } from 'stores/state/stateStore';

import { defaultUserdata } from 'stores/state/stateModels';
import { SourceMeta } from 'src/three/figures/sources';
import { MathUtils, Vector3 } from 'three';
import {
  cartesianToLatLon,
  localEarthToWorld,
  normalDirection,
} from 'src/utils/helpers';

const state = useState();

const selected = computed(
  (): SourceMeta => state.selectedSource ?? new SourceMeta(defaultUserdata)
);

const links = computed(() => selected.value.links);

const calculating = computed((): Vector3[] | [] =>
  (selected.value.links.length > 1
    ? selected.value.links.filter((_, index) => index < 2)
    : []
  ).map((l) => l.worldReceiver)
);

const source = computed(
  (): Vector3 =>
    selected.value.links.length > 1
      ? selected.value.links.filter((_, index) => index < 2)[0].localSource
      : new Vector3()
);

const coords = computed(() =>
  cartesianToLatLon(
    source.value.clone().add(state.vector3Deviation).normalize()
  )
);

const deviation = computed(() =>
  localEarthToWorld(
    source.value.distanceTo(source.value.clone().add(state.vector3Deviation)),
    2
  )
);

const getAngle = (receiver: Vector3, source: Vector3) => {
  return MathUtils.radToDeg(
    normalDirection(new Vector3(0, 0, 0), receiver, source)
  ).toFixed(2);
};

const getDistance = (point1: Vector3, point2: Vector3) => {
  return (localEarthToWorld(point1.distanceTo(point2)) / 3).toFixed(2);
};

const info = computed(() => [
  {
    label: 'Выбранный источник',
    value: selected.value.meta.label,
    color: 'red',
  },
  {
    label: 'Мощность',
    value: selected.value.meta.power + ' кВт',
    color: 'warning',
  },
  {
    label: 'Истинная широта',
    value: selected.value.meta.lat + '°',
    color: 'white',
  },
  {
    label: 'Истинная долгота',
    value: selected.value.meta.lon + '°',
    color: 'white',
  },
]);
</script>

<style scoped></style>
