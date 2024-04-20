import {
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  LineBasicMaterial,
  Line,
  Vector3,
  BufferGeometry,
  MathUtils,
} from 'three';

import { SourceObject, sources } from 'src/utils/sources';
import { Group } from 'three';
import { useState } from 'stores/state/stateStore';
import { getVector3Location, getVector3WorldPosition } from 'src/utils/helpers';
import { scene } from 'src/three';
import { planeGroup } from 'src/three/figures/sphere';
import { COLORS, SOURCE } from 'src/utils/constants';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { defaultUserdata } from 'stores/state/stateModels';

export function createText(position: Vector3, value: string) {
  const el = document.createElement('div');
  el.textContent = value;
  el.style.fontFamily = 'Yandex Sans Text';

  const label = new CSS2DObject(el);
  planeGroup.add(label);
  label.position.copy(position);
}

export function createCities() {
  for (const source of sources) {
    source.power = MathUtils.randInt(100, 1000);

    const dot = new Source(source);

    planeGroup.add(dot.mesh);
    scene.add(dot.group);
  }
}

export class Source {
  mesh = new Mesh();
  group = new Group();
  linked: Array<SourceLink> = [];
  meta: SourceMeta | null = null;

  get name(): string {
    return this.meta?.meta?.label || '';
  }

  constructor(source: SourceObject) {
    const state = useState();

    this.meta = new SourceMeta(source);
    const { label, lat, lon } = source;

    this.mesh.geometry = new SphereGeometry(0.035, 20, 20);
    this.mesh.material = new MeshBasicMaterial(COLORS.SOURCE);

    const { x, y, z } = getVector3Location(lat, lon);
    this.mesh.position.set(x, y, z);

    this.mesh.name = SOURCE + label;

    createText(this.mesh.position, label);

    this.updateLinked();

    state.sources.push(this);
  }

  move() {
    const state = useState();

    if (!state.visibleReceive && state.selectedSource?.meta.label !== this.name)
      return;

    for (const link of this.linked) {
      const [point1, point2] = getVector3WorldPosition(this.mesh, link.mesh);

      if (point1.distanceTo(point2) < state.visibilityDistance) {
        if (this.meta) {
          const positions = [
            point1,
            point2,
            this.mesh.clone().position,
            link.mesh.clone().position,
          ];

          this.meta.link(link, positions);
        }

        if (link.line) {
          link.line.move(point1, point2);

          continue;
        }

        link.line = new ConnectionLine(point1, point2);
        this.group.add(link.line.mesh);
      } else {
        if (link.line) this.group.remove(link.line.mesh);
        if (this.meta) this.meta.remove(link.mesh.uuid);

        link.line = null;
      }
    }
  }

  updateLinked() {
    const state = useState();

    this.linked = [];
    this.group.remove(...this.group.children);

    if (this.meta) {
      this.meta.links = [];
    }

    for (let index = 0; index < state.receivers.length; index++) {
      const receiver = state.receivers[index];
      this.linked.push({ mesh: receiver.mesh, line: null });
    }
  }
}

class ConnectionLine {
  mesh = new Line();

  constructor(point1: Vector3, point2: Vector3) {
    this.mesh.geometry = new BufferGeometry().setFromPoints([point1, point2]);
    this.mesh.material = new LineBasicMaterial(COLORS.LINE);
  }

  move(point1: Vector3, point2: Vector3) {
    this.mesh.geometry.setFromPoints([point1, point2]);
  }
}

export class SourceMeta {
  meta: SourceObject = defaultUserdata;
  links: Array<SourceMetaLink> = [];

  constructor(meta: SourceObject) {
    this.meta = meta;
  }

  link(link: SourceLink, positions: Vector3[]) {
    const metaLink = new SourceMetaLink(link.mesh.uuid, positions);

    if (this.links.map((l) => l.uuid).includes(link.mesh.uuid)) {
      this.links = this.links.map((l) => {
        if (l.uuid === link.mesh.uuid) {
          return metaLink;
        }

        return l;
      });

      return;
    }

    this.links.push(metaLink);
  }

  remove(index: string) {
    this.links = this.links.filter((l) => l.uuid !== index);
  }
}

export class SourceMetaLink {
  uuid = '';

  worldSource = new Vector3();
  worldReceiver = new Vector3();
  localSource = new Vector3();
  localReceiver = new Vector3();

  constructor(uuid: string, positions: Vector3[]) {
    const [worldSource, worldReceiver, localSource, localReceiver] = positions;

    this.uuid = uuid;
    this.worldSource = worldSource;
    this.worldReceiver = worldReceiver;
    this.localSource = localSource;
    this.localReceiver = localReceiver;
  }
}

interface SourceLink {
  line: ConnectionLine | null;
  mesh: Mesh;
}
