import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import StoreIcon from '@material-ui/icons/Store';
import HomeIcon from '@material-ui/icons/Home';

import * as THREE from 'three';
import {useDrag, useDrop} from 'react-dnd';
import TrainIcon from '@material-ui/icons/Train';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

import {SimpleDialog} from './SimpleDialog';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Props {
  title: string;
  scene: THREE.Scene;
  position: Position;
}

const ItemTypes = {
  DROP: 'drop',
  CONSIGNMENT: 'consignment',
};

export function NotAllowed({scene, position, title}: Props) {
  const div = React.useMemo(() => document.createElement('div'), []);

  const [{isOver, canDrop}, drop] = useDrop({
    accept: [],
    drop: () => alert('Do Something Crazy'),
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  React.useEffect(() => {
    const sphere = new THREE.SphereGeometry(10);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(position.x, position.y, position.z);
    const earthLabel = new CSS2DObject(div);

    mesh.add(earthLabel);
    scene.add(mesh);

    return () => {
      scene.remove(mesh);
    };
  }, [scene, div, position]);

  return ReactDOM.createPortal(
    <div ref={drop}>
      <HomeIcon
        fontSize="large"
        color={isOver ? (canDrop ? 'primary' : 'disabled') : undefined}
      />
    </div>,
    div
  );
}

export function Drop({scene, position, title}: Props) {
  const div = React.useMemo(() => document.createElement('div'), []);

  const [{isOver, canDrop}, drop] = useDrop({
    accept: ItemTypes.CONSIGNMENT,
    drop: () => alert('Do Something Crazy: ' + title),
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  React.useEffect(() => {
    const sphere = new THREE.SphereGeometry(10);
    // const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(
      sphere,
      new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        flatShading: true,
      })
    );
    mesh.position.set(position.x, position.y, position.z);
    const earthLabel = new CSS2DObject(div);

    mesh.add(earthLabel);
    scene.add(mesh);

    return () => {
      scene.remove(mesh);
    };
  }, [scene, div, position]);

  return ReactDOM.createPortal(
    <div ref={drop}>
      <StoreIcon
        fontSize="large"
        color={isOver ? (canDrop ? 'primary' : 'disabled') : undefined}
      />
    </div>,
    div
  );
}

export function Consignment({scene, position, title}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  const div = React.useMemo(() => document.createElement('div'), []);

  const [{opacity}, dragRef] = useDrag({
    item: {type: ItemTypes.CONSIGNMENT},
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  React.useEffect(() => {
    const sphere = new THREE.SphereGeometry(10);
    const mesh = new THREE.Mesh(
      sphere,
      new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        flatShading: true,
      })
    );
    mesh.position.set(position.x, position.y, position.z);
    const earthLabel = new CSS2DObject(div);
    mesh.add(earthLabel);
    scene.add(mesh);

    return () => {
      scene.remove(mesh);
    };
  }, [scene, div, position]);

  return ReactDOM.createPortal(
    <div ref={dragRef} style={{opacity}}>
      <IconButton
        onClick={() => {
          handleClickOpen();
        }}
        aria-label="delete"
      >
        <TrainIcon fontSize="large" />
      </IconButton>
      <SimpleDialog selectedValue={'value'} open={open} onClose={handleClose} />
    </div>,
    div
  );
}

export function NonTazo() {
  const [{opacity}, dragRef] = useDrag({
    item: {type: ItemTypes.CONSIGNMENT},
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  return (
    <span ref={dragRef} style={{opacity}}>
      <IconButton aria-label="delete">
        <TrainIcon fontSize="large" />
      </IconButton>
    </span>
  );
}
