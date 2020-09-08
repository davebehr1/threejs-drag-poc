import classes from './saldanhaPortStyles.module.css';
import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { loadSVG } from './loadSVG';
import saldanaPart from './icons/saldanhaPortPart.svg';
import saldanaPartOne from './icons/saldanaSVG2.svg';
import { MathUtils, Scene } from 'three';

export function generateUniqueId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export interface ThreeJsBackingConsignment {
  consignmentMask: HTMLDivElement;
  temp: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>;
  consignmentGlow: HTMLDivElement;
  tempCons: CSS2DObject;
  consignmentWrapper: HTMLDivElement;
}

export function createConsignment(
  scene: Scene,
  position: THREE.Vector3,
  variant: string,
  placeHolderMaterial: THREE.MeshPhongMaterial,
  name: string,
  consNumber: number,
  capacity: number
): ThreeJsBackingConsignment {
  const consignmentWrapper = document.createElement('div');
  consignmentWrapper.className = classes.ConsignmentWrapper;
  const consignment = document.createElement('div');
  consignment.className = classes.Consignment;
  consignment.style.backgroundColor = variant;

  const consignmentGlow = document.createElement('div');
  consignmentGlow.className = classes.ConsignmentGlow;
  consignmentGlow.style.backgroundColor = variant;

  const consignmentMask = document.createElement('div');
  consignmentMask.className = classes.ConsignmentBack;
  consignmentMask.style.width = `${100 - capacity}%`;

  consignmentMask.style.display = 'block';
  consignmentGlow.style.display = 'block';

  const innerCircle = document.createElement('div');
  innerCircle.innerHTML = consNumber.toString();
  innerCircle.className = classes.innerConsignment;

  const arrowDown = document.createElement('div');
  arrowDown.className = classes.arrowDown;
  arrowDown.style.borderTopColor = variant;

  consignmentWrapper.id = name;
  consignment.appendChild(consignmentMask);

  consignment.appendChild(innerCircle);
  consignmentWrapper.appendChild(consignment);
  consignmentWrapper.appendChild(consignmentGlow);
  consignmentWrapper.appendChild(arrowDown);

  const tempCons = new CSS2DObject(consignmentWrapper);
  tempCons.position.set(position.x, position.y, position.z);

  const geometry = new THREE.BoxGeometry(90, 90, 90);

  const temp = new THREE.Mesh(geometry, placeHolderMaterial);

  temp.name = name;
  temp.position.set(position.x, position.y, position.z);

  temp.children[0] = tempCons;

  scene.add(temp);
  scene.add(tempCons);

  return { consignmentMask, temp, consignmentGlow, tempCons, consignmentWrapper };
}

export function addTable(
  scene: THREE.Scene,
  tilePositions: Map<
    string,
    {
      xPos: number;
      zPos: number;
      length: number;
      amount: number;
      grade: string;
      position: number;
    }
  >,
  objects: THREE.Object3D[],
  group: THREE.Group
): THREE.Object3D[] {
  const table: THREE.Object3D[] = [];
  const board = document.createElement('div');
  board.className = classes.board;
  let previousPosition = 0;
  let previousLength = 0;
  let index = 0;
  let prevXIndex = 0;

  const trackOne = document.createElement('div');
  const trackOneLabel = document.createElement('div');
  trackOneLabel.innerText = '1';
  trackOneLabel.className = classes.reclaimerTrackLabel;

  const trackTwo = document.createElement('div');
  const trackTwoLabel = document.createElement('div');
  trackTwoLabel.innerText = '2';
  trackTwoLabel.className = classes.reclaimerTrackLabel;

  const trackThree = document.createElement('div');
  const trackThreeLabel = document.createElement('div');
  trackThreeLabel.innerText = '3';
  trackThreeLabel.className = classes.reclaimerTrackLabel;

  const trackFour = document.createElement('div');
  const trackFourLabel = document.createElement('div');
  trackFourLabel.innerText = '4';
  trackFourLabel.className = classes.reclaimerTrackLabel;

  trackOne.className = classes.reclaimerTrack;
  trackTwo.className = classes.reclaimerTrack;
  trackThree.className = classes.reclaimerTrack;
  trackFour.className = classes.reclaimerTrack;

  trackOne.appendChild(trackOneLabel);
  trackTwo.appendChild(trackTwoLabel);
  trackThree.appendChild(trackThreeLabel);
  trackFour.appendChild(trackFourLabel);

  const loadingBeds = new CSS3DObject(board);
  loadingBeds.position.set(280, 0, -210);
  loadingBeds.rotation.x = -Math.PI / 2;
  scene.add(loadingBeds);
  table.push(loadingBeds);

  const trackOneObject = new CSS3DObject(trackOne);
  trackOneObject.position.set(-80, 0, -210);
  trackOneObject.rotation.x = -Math.PI / 2;

  const trackTwoObject = new CSS3DObject(trackTwo);
  trackTwoObject.position.set(160, 0, -210);
  trackTwoObject.rotation.x = -Math.PI / 2;

  const trackThreeObject = new CSS3DObject(trackThree);
  trackThreeObject.position.set(400, 0, -210);
  trackThreeObject.rotation.x = -Math.PI / 2;

  const trackFourObject = new CSS3DObject(trackFour);
  trackFourObject.position.set(640, 0, -210);
  trackFourObject.rotation.x = -Math.PI / 2;

  scene.add(trackOneObject);
  table.push(trackOneObject);
  scene.add(trackTwoObject);
  table.push(trackTwoObject);
  scene.add(trackThreeObject);
  table.push(trackThreeObject);
  scene.add(trackFourObject);
  table.push(trackFourObject);

  tilePositions.forEach((value, key) => {
    if (prevXIndex !== value.xPos) {
      index = 0;
      previousPosition = 0;
      previousLength = 0;
    }

    const element = document.createElement('div');
    element.className = classes.tile;

    element.style.height = value.length.toString().concat('px');

    element.innerHTML = key;

    const object = new CSS3DObject(element);

    object.position.x = value.xPos * 120 - 20;

    if (index > 0) {
      object.position.z =
        previousPosition + previousLength / 2 + value.length / 2 + 10;

      previousPosition =
        previousPosition + previousLength / 2 + value.length / 2 + 10;

      tilePositions.set(key, { ...value, position: object.position.z });
    } else {
      const adjustedPosition = value.length - 400;
      object.position.z = -400 + adjustedPosition / 2;

      tilePositions.set(key, { ...value, position: object.position.z });

      previousPosition = -400 + adjustedPosition / 2;
    }

    object.rotation.x = -Math.PI / 2;

    group.add(object);

    objects.push(object);

    previousLength = value.length;
    index++;
    prevXIndex = value.xPos;
  });

  scene.add(group);
  table.push(group);
  return table;
}

export function addStockPiles(
  tilePositions: Map<
    string,
    {
      xPos: number;
      zPos: number;
      length: number;
      amount: number;
      grade: string;
      position: number;
    }
  >,
  fineMaterial: THREE.MeshPhongMaterial,
  lumpMaterial: THREE.MeshPhongMaterial,
  dragMeshes: THREE.Object3D[],
  scene: THREE.Scene,
  collisions: THREE.Object3D[]
): THREE.Object3D[] {
  const elements: THREE.Object3D[] = [];
  tilePositions.forEach((value, key) => {
    if (value.amount > 0) {
      if (value.grade === 'fine') {
        const tempGroup = new THREE.Group();
        tempGroup.name = 'fineStockPile';
        for (let i = 0; i < value.amount; ++i) {
          const geometry = new THREE.BoxGeometry(
            80 - i * 15,
            10,
            value.length - 10 - i * 15
          );

          if (i + 1 === value.amount) {
            addTextureLabel(scene, key, value, i, '#2068f3');
          }
          const cube = new THREE.Mesh(geometry, fineMaterial);

          cube.position.set(value.xPos * 120 - 20, i * 10, value.position);

          cube.name = `fine-${key}`;
          dragMeshes.push(cube);
          collisions.push(cube);
          tempGroup.add(cube);
        }
        scene.add(tempGroup);
        elements.push(tempGroup);
      } else {
        const tempGroup = new THREE.Group();
        tempGroup.name = 'lumpStockPile';
        const amount = value.amount;
        if (amount)
          for (let i = 0; i < amount; ++i) {
            const geometry = new THREE.BoxGeometry(
              80 - i * 15,
              10,
              value.length - 10 - i * 15
            );

            if (i + 1 === value.amount) {
              addTextureLabel(scene, key, value, i, '#fb9d5b');
            }
            const cube = new THREE.Mesh(geometry, lumpMaterial);

            cube.name = `lump-${key}`;
            cube.position.set(value.xPos * 120 - 20, i * 10, value.position);
            collisions.push(cube);
            tempGroup.add(cube);
          }
        scene.add(tempGroup);
        elements.push(tempGroup);
      }
    }
  });
  return elements;
}

export const unprojectCoordinates = (
  object: THREE.Mesh,
  camera: THREE.OrthographicCamera
) => {
  let pos = new THREE.Vector3();
  pos = pos.setFromMatrixPosition(object.matrixWorld);
  pos.project(camera);

  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;

  pos.x = pos.x * widthHalf + widthHalf;
  pos.y = -(pos.y * heightHalf) + heightHalf;
  pos.z = 0;
};

export const createGraphics = (position: THREE.Vector3, scene: THREE.Scene) => {
  const trainTrack = document.createElement('div');
  trainTrack.className = classes.trainTrack;
  trainTrack.id = 'trainTrack';

  const conveyor = document.createElement('div');
  conveyor.className = classes.conveyor;
  conveyor.id = 'conveyor';

  const conveyorEnd = document.createElement('div');
  conveyorEnd.className = classes.conveyorEnd;

  const conveyorLabelRight = document.createElement('div');
  conveyorLabelRight.className = classes.conveyorLabel;
  conveyorLabelRight.innerText = 'OBS';
  const conveyorLabelLeft = document.createElement('div');
  conveyorLabelLeft.className = classes.conveyorLabel;
  conveyorLabelLeft.style.left = '180px';
  conveyorLabelLeft.innerText = 'OBS';

  const conveyorTerminalOne = document.createElement('div');
  conveyorTerminalOne.className = classes.terminal;
  const conveyorTerminalTwo = document.createElement('div');
  conveyorTerminalTwo.className = classes.terminal;

  const terminals = document.createElement('div');
  terminals.className = classes.terminals;

  conveyor.appendChild(conveyorEnd);
  terminals.appendChild(conveyorTerminalOne);
  terminals.appendChild(conveyorTerminalTwo);
  conveyorTerminalOne.appendChild(conveyorLabelLeft);
  conveyorTerminalTwo.appendChild(conveyorLabelRight);
  conveyorEnd.appendChild(terminals);

  const object = new CSS3DObject(trainTrack);
  object.position.set(position.x, position.y, position.z);
  object.rotation.x = Math.PI / 2;
  object.rotation.y = 0;
  object.rotation.z = 0;

  const conveyorObject = new CSS3DObject(conveyor);
  conveyorObject.position.set(position.x, position.y, position.z + 2300);
  conveyorObject.rotation.x = Math.PI / 2;
  conveyorObject.rotation.y = 0;
  conveyorObject.rotation.z = 0;

  scene.add(object);

  scene.add(conveyorObject);
};

export const addCustomSceneObjects = (scene: THREE.Scene) => {
  scene.add(new THREE.AmbientLight(0x666666));

  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  const d = 300;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 1000;

  scene.add(light);
};

export const setupScene = (
  scene: THREE.Scene,
  loadingManager: THREE.LoadingManager
) => {
  addCustomSceneObjects(scene);

  const saldanaGraphicOne = loadSVG(saldanaPart, loadingManager);

  saldanaGraphicOne.rotation.x = Math.PI / 2;
  saldanaGraphicOne.rotation.z = MathUtils.degToRad(-20);

  saldanaGraphicOne.scale.set(2.5, 2.5, 2.5);
  saldanaGraphicOne.position.set(-900, 0, -400);

  // var geometry = new THREE.SphereGeometry(100);
  // var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  // var sphere = new THREE.Mesh(geometry, material);

  // scene.add(sphere);
  scene.add(saldanaGraphicOne);

  const saldanaGraphicTwo = loadSVG(saldanaPartOne, loadingManager);

  saldanaGraphicTwo.rotation.x = Math.PI / 2;
  saldanaGraphicTwo.rotation.z = MathUtils.degToRad(-20);

  saldanaGraphicTwo.scale.set(4.0, 4.0, 4.0);
  saldanaGraphicTwo.position.set(-1950, 0, -900);
  scene.add(saldanaGraphicTwo);

  return saldanaGraphicTwo;
};

export const addTextureLabel = (
  scene: Scene,
  key: string,
  value: {
    xPos: number;
    zPos: number;
    length: number;
    amount: number;
    grade: string;
    position: number;
  },
  i: number,
  backgroundColor: string
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  if (context) {
    context.fillStyle = backgroundColor;
    context.clearRect(0, 0, 600, 600);

    context.font = '90pt Roboto';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillRect(0, 0, 600, 600);
    context.fillStyle = 'black';
    context.fillText(key, x, y);
  }
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.MeshPhongMaterial({ map: texture });
  material.name = 'fineLabelTexture';
  const plane = new THREE.PlaneGeometry(20, 20);
  const tempPlane = new THREE.Mesh(plane, material);
  tempPlane.rotation.x = Math.PI / -2;
  tempPlane.position.set(value.xPos * 120 - 20, i * 10 + 6, value.position);
  scene.add(tempPlane);
};
