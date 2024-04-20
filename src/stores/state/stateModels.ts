import { OrbitGroup, Receiver } from 'src/three/figures/elements';
import { Source, SourceMeta } from 'src/three/figures/sources';
import { Vector2 } from 'three';

export interface StateModels {
  time: number;
  method: number;

  orbits: Array<OrbitGroup>;

  sources: Array<Source>;
  receivers: Array<Receiver>;

  play: boolean;
  info: boolean;

  speed: number;
  mouse: Vector2;

  visibleReceive: boolean;

  selectedSource: SourceMeta | null;

  bounds: {
    orbit: number;
    zone: number;
    offset: number;
    degreeReceiver: number;
    degreeOrbit: number;
  };

  groupings: {
    orbit: number;
    receiver: number;
  };
  count: {
    orbit: number;
    receiver: number;
  };

  multipliers: {
    power: number;
    receiver: number;
    distance: number;
  };
}

export const defaultUserdata = {
  label: '',
  lat: 0,
  lon: 0,
  power: 0,
};
