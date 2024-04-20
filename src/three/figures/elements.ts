import {
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import { COLORS, RADIUS } from 'src/utils/constants';
import { orbitGroup } from 'src/three';
import { useState } from 'stores/state/stateStore';
import { realEarthToLocal } from 'src/utils/helpers';

export class OrbitGroup {
  mesh: Mesh = new Mesh();
  group: Group = new Group();
  common: Group = new Group();
  receivers: Array<Receiver> = [];

  deviation = 0;
  ratio = 0;
  zone = 0;

  constructor(ratio: number, zone: number, deviation: number) {
    this.ratio = ratio;
    this.zone = zone;
    this.deviation = deviation;

    this.mesh.geometry = new TorusGeometry(this.ratio, 0.005, 10, 100);
    this.mesh.material = new MeshBasicMaterial(COLORS.ORBIT);

    this.group.add(this.mesh, this.common);
    this.group.rotation.y = this.deviation;

    orbitGroup.add(this.group);
  }

  createSatellite(deviation: number) {
    this.receivers.push(
      new Receiver(this.common, deviation, this.ratio, this.zone)
    );
  }

  move(time: number) {
    this.receivers.forEach((receiver) => receiver.move(time));
  }

  updateOrbits(count: number) {
    const state = useState();
    this.common.remove(...this.common.children);
    this.receivers = [];
    state.receivers = [];

    for (let i = 0; i < count; i++) {
      const angle = MathUtils.degToRad((360 / count) * i);

      this.createSatellite(angle);
    }

    state.sources.forEach((item) => item.updateLinked());
  }
}

export class Receiver {
  mesh = new Mesh();
  ratio = 0;
  zone: Zone | null = null;
  constructor(group: Group, deviation: number, ratio: number, radius: number) {
    const state = useState();
    this.ratio = ratio;

    this.mesh.geometry = new SphereGeometry(0.08, 20, 20);
    this.mesh.material = new MeshBasicMaterial(COLORS.RECEIVER);

    this.mesh.position.x = this.ratio * Math.sin(deviation);
    this.mesh.position.y = this.ratio * Math.cos(deviation);

    this.mesh.userData = { deviation };

    this.zone = new Zone(group, deviation, radius);

    group.add(this.mesh);

    state.receivers.push(this);
  }

  move(time: number) {
    const deviation = time + (this.mesh.userData?.deviation ?? 1);

    this.mesh.position.x = this.ratio * Math.sin(deviation);
    this.mesh.position.y = this.ratio * Math.cos(deviation);

    if (this.zone) {
      this.zone.move(time);
    }
  }
}

class Zone {
  mesh = new Mesh();
  group = new Group();

  ratio = 0;
  get radius() {
    return realEarthToLocal(this.ratio);
  }

  get delta() {
    return (
      RADIUS -
      0.0135 * ((this.ratio - 500 === 0 ? 100 : this.ratio - 500) / 100)
    );
  }

  constructor(group: Group, deviation: number, ratio: number) {
    this.ratio = ratio;

    this.mesh.geometry = new TorusGeometry(this.radius, 0.005, 10, 100);
    this.mesh.material = new MeshBasicMaterial(COLORS.ZONE);

    this.mesh.position.x = this.radius * Math.sin(deviation);
    this.mesh.position.y = this.radius * Math.cos(deviation);
    this.mesh.rotation.x = Math.PI / 2;

    this.mesh.userData = { deviation };

    group.add(this.mesh);
    group.add(this.group);
  }

  move(time: number) {
    const deviation = time + (this.mesh.userData?.deviation ?? 1);

    this.mesh.position.x = this.delta * Math.sin(deviation);
    this.mesh.position.y = this.delta * Math.cos(deviation);

    this.mesh.rotation.y =
      this.mesh.position.y > 0
        ? -Math.asin(Math.sin(deviation))
        : Math.asin(Math.sin(deviation));
  }
}
