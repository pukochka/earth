import { Mesh, Vector3 } from 'three';
import { EARTH_RADIUS, RADIUS } from 'src/utils/constants';

export function getVector3Location(lat: number, lon: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(RADIUS * Math.sin(phi) * Math.cos(theta));
  const y = RADIUS * Math.cos(phi);
  const z = RADIUS * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}

export function getVector3WorldPosition(
  mesh1: Mesh,
  mesh2: Mesh
): [Vector3, Vector3] {
  return [
    new Vector3().setFromMatrixPosition(mesh1.clone().matrixWorld),
    new Vector3().setFromMatrixPosition(mesh2.clone().matrixWorld),
  ];
}

export function normalDirection(start: Vector3, middle: Vector3, end: Vector3) {
  const { x, y, z } = middle;

  const vec1 = new Vector3(start.x - x, start.y - y, start.z - z);
  const vec2 = new Vector3(end.x - x, end.y - y, end.z - z);

  const v1mag = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z);
  const v1norm = new Vector3(vec1.x / v1mag, vec1.y / v1mag, vec1.z / v1mag);

  const v2mag = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y + vec2.z * vec2.z);
  const v2norm = new Vector3(vec2.x / v2mag, vec2.y / v2mag, vec2.z / v2mag);

  return Math.acos(
    v1norm.x * v2norm.x + v1norm.y * v2norm.y + v1norm.z * v2norm.z
  );
}

export function cartesianToLatLon(position: Vector3) {
  const { x, y, z } = position;
  const lat = 90 - (Math.acos(y) / Math.PI) * 180;
  const lon = (-Math.atan2(z, x) / Math.PI) * 180;
  return { lat, lon };
}

export function localEarthToWorld(value: number, fixed?: number) {
  const calculated = (value * EARTH_RADIUS) / RADIUS;
  return fixed ? Number(calculated.toFixed(fixed)) : calculated;
}

export function realEarthToLocal(value: number, fixed?: number) {
  const calculated = (value / EARTH_RADIUS) * RADIUS;
  return fixed ? Number(calculated.toFixed(fixed)) : calculated;
}

export function hypotenuse(
  catheter1: number,
  catheter2: number,
  deviation?: number
) {
  return (
    Math.sqrt(Math.pow(catheter1, 2) + Math.pow(catheter2, 2)) +
    (deviation || 0)
  );
}
