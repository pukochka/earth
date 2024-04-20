import { scene, renderer, labelRenderer } from './';
import { camera } from './figures/camera';
import { useState } from 'stores/state/stateStore';

import { planeGroup } from 'src/three/figures/sphere';
import { EARTH_ROTATE_SPEED, FIRST_SPACE_SPEED } from 'src/utils/constants';
import { throttle } from 'quasar';

export function animate() {
  requestAnimationFrame(animate);

  render();
}

function updateCities() {
  const state = useState();
  state.sources.forEach((item) => item.move());
}

const throttleUpdate = throttle(updateCities, 24);

function render() {
  const state = useState();

  if (!state.play) {
    state.time += FIRST_SPACE_SPEED * state.speed;
    planeGroup.rotation.y += EARTH_ROTATE_SPEED * state.speed;

    state.orbits.forEach((item) => item.move(state.time));

    throttleUpdate();
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
