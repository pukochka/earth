import { PerspectiveCamera } from 'three';

import { renderer } from 'src/three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls';

export const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

camera.position.z = 15;

export function installControls() {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.update();

  controls.rotateSpeed = 0.5;
  controls.maxDistance = 80;
  controls.minDistance = 8;
}
