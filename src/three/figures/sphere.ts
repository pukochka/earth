import {
  Group,
  Mesh,
  SphereGeometry,
  ShaderMaterial,
  TextureLoader,
} from 'three';

import { RADIUS } from 'src/utils/constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shader from '../shaders/vertex.glsl';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fragment from '../shaders/fragment.glsl';

export const planeGroup = new Group();

export const plane = new Mesh(
  new SphereGeometry(RADIUS, 50, 50),
  new ShaderMaterial({
    vertexShader: shader,
    fragmentShader: fragment,
    uniforms: {
      globeTexture: {
        value: new TextureLoader().load('./8kearth.jpg'),
      },
    },
  })
);

planeGroup.add(plane);
