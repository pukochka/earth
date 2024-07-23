import { localEarthToWorld } from 'src/utils/helpers';
import { SourceMetaLink } from 'src/three/figures/sources';
import { Vector3 } from 'three';

export const getWait = (links: Array<SourceMetaLink>, index: number) => {
  const first = links[index];
  const second = links[index + 1];

  const distance1 =
    localEarthToWorld(first.worldReceiver.distanceTo(first.worldSource)) * 1e3;
  const distance2 =
    localEarthToWorld(second.worldReceiver.distanceTo(second.worldSource)) *
    1e3;

  const wait1 = distance1 / (3 * 1e8);
  const wait2 = distance2 / (3 * 1e8);

  return (Math.abs(wait1 - wait2) * 1e9).toFixed(3);
};

export const calculateRDM = (
  receiver1: Vector3,
  receiver3: Vector3,
  delay1: number,
  delay2: number
) => {
  const maxIterations = 1000; // Максимальное количество итераций

  for (let i = 0; i < maxIterations; i++) {
    let x = 0;
    let y = 0;

    // Значения функций
    const f1 = (x - receiver1.x) ** 2 - (y - receiver1.y) ** 2 - delay1;
    const f2 = (x - receiver3.x) ** 2 - (y - receiver3.y) ** 2 - delay2;

    // Производные функций
    const dF1dx = 2 * (x - receiver1.x);
    const dF1dy = -2 * (y - receiver1.y);
    const dF2dx = 2 * (x - receiver3.x);
    const dF2dy = -2 * (y - receiver3.y);

    // Якобиан
    const jacobian = [
      [dF1dx, dF1dy],
      [dF2dx, dF2dy],
    ];

    // Определитель Якобиана
    const detJ =
      jacobian[0][0] * jacobian[1][1] - jacobian[0][1] * jacobian[1][0];

    // Обратный Якобиан
    const invJacobian = [
      [jacobian[1][1] / detJ, -jacobian[0][1] / detJ],
      [-jacobian[1][0] / detJ, jacobian[0][0] / detJ],
    ];

    // Шаг Ньютона
    const deltaX = -invJacobian[0][0] * f1 - invJacobian[0][1] * f2;
    const deltaY = -invJacobian[1][0] * f1 - invJacobian[1][1] * f2;

    // Обновление приближений
    x += deltaX;
    y += deltaY;

    // Проверка сходимости
    return { x, y };
  }
};

export const calculateGoniometric = (
  receiver1: Vector3,
  receiver2: Vector3,
  angle1: number,
  angle2: number
) => {
  const sin = Math.sin;
  const cos = Math.cos;

  const denominator = sin(angle1) * sin(angle2) - cos(angle1) * sin(angle2);

  const base = localEarthToWorld(receiver1.distanceTo(receiver2));

  const x = receiver1.x + (base * cos(angle1) * sin(angle2)) / denominator;
  const y = receiver1.y + (base * cos(angle1) * cos(angle2)) / denominator;

  return { x, y };
};
