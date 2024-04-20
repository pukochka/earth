import { boot } from 'quasar/wrappers';
import { createCities } from 'src/three/figures/sources';
import { installControls } from 'src/three/figures/camera';
import { planeGroup } from 'src/three/figures/sphere';
import { useState } from 'stores/state/stateStore';
import { orbitGroup, scene } from 'src/three';

export default boot(() => {
  installControls();

  scene.add(planeGroup, orbitGroup);

  const state = useState();

  state.updateOrbits();

  createCities();

  orbitGroup.rotation.x = orbitGroup.rotation.y =
    (state.bounds.offset * Math.PI) / 180;
});
