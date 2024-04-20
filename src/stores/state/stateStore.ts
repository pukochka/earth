import { defineStore } from 'pinia';
import { StateModels } from 'stores/state/stateModels';
import { OrbitGroup } from 'src/three/figures/elements';
import { EARTH_RADIUS, RADIUS, SOURCE } from 'src/utils/constants';
import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';
import { camera } from 'src/three/figures/camera';
import { planeGroup } from 'src/three/figures/sphere';

import { hypotenuse, realEarthToLocal } from 'src/utils/helpers';

const raycaster = new Raycaster();

const yellowColor = new MeshBasicMaterial({ color: '#F2C037' });
const redColor = new MeshBasicMaterial({ color: '#ff0000' });

const count: Record<number, number> = {
  2: 0.9,
  3: 0.85,
  4: 0.8,
  5: 0.75,
  6: 0.7,
  7: 0.65,
  8: 0.6,
  9: 0.55,
  10: 0.5,
  11: 0.45,
  12: 0.43,
  13: 0.4,
  14: 0.37,
  15: 0.33,
  16: 0.32,
};

export const useState = defineStore('earth-state', {
  state: () =>
    ({
      time: 0,
      method: 0,
      speed: 0.1,
      mouse: new Vector2(),

      play: false,
      info: false,
      visibleReceive: false,

      orbits: [],
      sources: [],
      receivers: [],

      selectedSource: null,

      bounds: {
        orbit: 900,
        zone: 1500,
        offset: 0,
        degreeOrbit: 2,
        degreeReceiver: 1,
      },

      groupings: {
        orbit: 1,
        receiver: 4,
      },
      count: {
        orbit: 1,
        receiver: 4,
      },
      multipliers: {
        power: 0.0187,
        receiver: 0.00325,
        distance: 0.02438,
      },
    } as StateModels),
  getters: {
    satelliteDegrees: (state): number =>
      MathUtils.degToRad(state.bounds.degreeReceiver),
    orbitDegrees: (state): number =>
      MathUtils.degToRad(state.bounds.degreeOrbit),

    visibilityDistance: (state) =>
      realEarthToLocal(hypotenuse(state.bounds.zone, state.bounds.orbit, 50)),
    orbitHeight: (state): number =>
      realEarthToLocal(EARTH_RADIUS + state.bounds.orbit),
    zoneRadius: (state): number => realEarthToLocal(state.bounds.zone),

    vector3Deviation(state) {
      if (state.selectedSource) {
        const { power } = state.selectedSource.meta;
        const { links } = state.selectedSource;

        const powerDeviation = 1 - power / 1e3;
        const sourceDeviation = count[links.length || 16];
        const distanceDeviation =
          state.multipliers.distance *
          (links
            .map((l) => l.worldSource.distanceTo(l.worldReceiver))
            .reduce((acc, rec) => acc + rec, 0) /
            links.length);

        const composition =
          powerDeviation * sourceDeviation * distanceDeviation +
          (state.method === 0 ? 0.001 : 0);

        return new Vector3(composition, composition, 0);
      }

      return new Vector3(0, 0, 0);
    },
  },
  actions: {
    animatePlay() {
      this.play = !this.play;
    },

    handleClick() {
      raycaster.setFromCamera(this.mouse, camera);
      const intersects = raycaster.intersectObjects(planeGroup.children);

      if (intersects.length) {
        const mesh = <Mesh>intersects[0].object;

        if (mesh.name.includes(SOURCE)) {
          const name = mesh.name.replace(SOURCE, '');
          const condition = name !== this.selectedSource?.meta?.label;

          this.sources.forEach((s) => (s.mesh.material = yellowColor));

          this.info = condition;
          mesh.material = condition ? redColor : yellowColor;

          this.sources.forEach((s) => {
            s.group.remove(...s.group.children);
            if (s.name === name) {
              s.updateLinked();
              if (s.meta) s.meta.links = [];
            }
          });

          for (const source of this.sources) {
            if (condition && source.name === name) {
              this.selectedSource = source.meta;

              return;
            }

            this.selectedSource = null;
          }
        }
      }
    },

    handleMousemove(ev: MouseEvent) {
      this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -((ev.clientY - 36) / window.innerHeight) * 2 + 1;
    },

    updateOrbits() {
      this.orbits.forEach((item) => item.group.remove(...item.group.children));
      this.orbits = [];
      this.receivers = [];

      let relatedOrbit = 0;
      let groupOrbit = 1;

      for (let i = 0; i < this.count.orbit; i++) {
        relatedOrbit++;

        const index =
          this.groupings.orbit !== 1
            ? relatedOrbit * this.orbitDegrees + groupOrbit
            : i;
        const groups = Math.ceil(this.count.orbit / this.groupings.orbit);
        const offset = MathUtils.degToRad((180 / groups) * index);

        const orbit = new OrbitGroup(
          this.orbitHeight,
          this.bounds.zone,
          offset
        );

        if (relatedOrbit === this.groupings.orbit) {
          relatedOrbit = 0;
          groupOrbit++;
        }

        let relatedSatellite = 0;
        let groupSatellite = 1;

        for (let i = 0; i < this.count.receiver; i++) {
          relatedSatellite++;

          const index =
            this.groupings.receiver !== 1
              ? relatedSatellite * this.satelliteDegrees + groupSatellite
              : i;
          const groups =
            this.count.receiver > 4 || this.groupings.receiver === 1
              ? Math.ceil(this.count.receiver / this.groupings.receiver)
              : 2;

          const offset = MathUtils.degToRad((360 / groups) * index);

          if (relatedSatellite === this.groupings.receiver) {
            relatedSatellite = 0;
            groupSatellite++;
          }

          orbit.createSatellite(offset);
        }

        this.orbits.push(orbit);
      }

      this.sources.forEach((item) => item.updateLinked());
    },
  },
});

window.addEventListener('mousemove', useState().handleMousemove);
window.addEventListener('click', useState().handleClick);
