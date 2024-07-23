<template>
  <div class="row justify-between items-center">
    <div class="row items-center q-pl-md q-gutter-x-sm">
      <q-btn-dropdown
        flat
        no-caps
        padding="2px 8px"
        color="white"
        label="Количество"
        class="rounded"
        content-class="portal-menu"
      >
        <count-menu></count-menu>
      </q-btn-dropdown>

      <q-btn-dropdown
        flat
        no-caps
        padding="2px 8px"
        color="white"
        label="Значения"
        class="rounded"
        content-class="portal-menu"
      >
        <bounds-menu></bounds-menu>
      </q-btn-dropdown>

      <q-btn-dropdown
        flat
        no-caps
        padding="2px 8px"
        color="white"
        label="Группировки"
        class="rounded"
        content-class="portal-menu"
      >
        <groupings-menu></groupings-menu>
      </q-btn-dropdown>

      <q-btn-dropdown
        flat
        no-caps
        padding="2px 8px"
        color="white"
        label="Метод ОМП"
        class="rounded"
        content-class="portal-menu"
      >
        <q-list bordered class="rounded">
          <q-item
            v-for="([value, label], index) of Object.entries(methods)"
            :key="index"
            @click="state.method = Number(value)"
            clickable
            active-class="text-info"
            :active="state.method === Number(value)"
          >
            <q-item-section>
              <q-item-label>{{ label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div class="row absolute-center">
      <q-btn
        flat
        square
        size="md"
        color="info"
        padding="6px 32px"
        :icon="state.play ? 'play_arrow' : 'pause'"
        @click="state.animatePlay"
      />

      <q-btn
        flat
        square
        no-caps
        size="md"
        color="info"
        padding="6px 32px"
        :label="'x ' + state.speed"
      >
        <q-menu class="portal-menu" fit>
          <q-list>
            <q-item
              dense
              clickable
              v-close-popup
              v-for="speed in speeds"
              :key="speed"
              @click="state.speed = speed"
            >
              <q-item-section
                class="text-no-wrap text-center"
                :class="[state.speed === speed ? ' text-info' : '']"
              >
                x {{ speed }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <div class="row">
      <q-btn
        flat
        square
        size="md"
        color="white"
        :disable="!state.selectedSource"
        :icon="state.info ? 'chevron_right' : 'info'"
        @click="state.info = !state.info"
      >
        <q-tooltip class="text-body2" v-if="!state.selectedSource">
          Для просмотра данных, выберите источник
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from 'stores/state/stateStore';

import { mdiSpeedometer } from '@quasar/extras/mdi-v7';

import CountMenu from 'components/CountMenu.vue';
import GroupingsMenu from 'components/GroupingsMenu.vue';
import BoundsMenu from 'components/BoundsMenu.vue';

const state = useState();

const speeds = [0.001, 0.1, 0.5, 1, 2, 4, 8, 10];

const methods = {
  0: 'Угломерный',
  1: 'Разностно-дальномерный',
};
</script>

<style scoped></style>
