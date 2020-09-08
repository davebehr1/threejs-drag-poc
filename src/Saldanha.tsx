import * as React from 'react';
import * as THREE from 'three';

import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {setupScene} from './copied/scene';
import {Consignment, Drop, NotAllowed, NonTazo} from './Tazo';
import {Switch, Typography} from '@material-ui/core';

const factor = 10;

export function Saldanha() {
  const [showConsignments, setShowConsignments] = React.useState(true);

  const {scene, camera} = React.useMemo(() => {
    const scene = new THREE.Scene();

    const manager = new THREE.LoadingManager();

    setupScene(scene, manager);
    // addCustomSceneObjects(scene);

    const d = 800;
    const aspect = window.innerWidth / window.innerHeight;

    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      20000
    );
    camera.position.set(539.5263817666128, 700.3826180031002, 700.242394518018);

    return {
      scene,
      camera,
    };
  }, []);

  const handleRef: React.RefCallback<HTMLDivElement> = React.useCallback(
    (element) => {
      if (element) {
        const {x, y, width, height} = element.getBoundingClientRect();
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        element.appendChild(renderer.domElement);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(width, height);
        labelRenderer.domElement.style.position = 'absolute';

        labelRenderer.domElement.style.top = `${y}px`;
        labelRenderer.domElement.style.left = `${x}px`;

        element.appendChild(labelRenderer.domElement);

        const animate = function () {
          requestAnimationFrame(animate);
          // cube.rotation.x += 0.01;
          // cube.rotation.y += 0.01;
          renderer.render(scene, camera);
          labelRenderer.render(scene, camera);
        };

        animate();
      }
    },
    [camera, scene]
  );

  const consignments = React.useMemo(() => {
    const results: any[] = [];

    const xStart = -1400;
    const yStart = -1400;

    // for (let i = 0; i < factor; i++) {
    //   results.push(
    //     <Consignment
    //       key={`1-${i}`}
    //       scene={scene}
    //       title={`Tazo ${i + 1}`}
    //       position={{
    //         x: xStart + i * 50,
    //         y: yStart + i * 50,
    //         z: i % 2 === 0 ? 100 : -100,
    //       }}
    //     />
    //   );
    // }

    for (let i = 0; i < factor; i++) {
      results.push(
        <Consignment
          key={`2-${i}`}
          scene={scene}
          title={`Tazo ${i + 1}`}
          position={{
            x: xStart + i * 50,
            y: yStart + i * 50,
            z: i % 2 === 0 ? 800 : -800,
          }}
        />
      );
    }

    return results;
  }, [scene]);

  return (
    <div>
      <div>
        <NonTazo />
        <Typography component="span">Show Consignments</Typography>
        <Switch
          checked={showConsignments}
          onChange={(_, checked) => {
            setShowConsignments(checked);
          }}
        />
      </div>
      <div ref={handleRef} style={{width: '100wh', height: '100vh'}}>
        {showConsignments && consignments}

        <Drop scene={scene} title="Tazo 1" position={{x: 400, y: 0, z: 200}} />
        <Drop
          scene={scene}
          title="Tazo 2"
          position={{x: 800, y: 100, z: 200}}
        />

        <NotAllowed
          scene={scene}
          title="Tazo 3"
          position={{x: 1200, y: 100, z: 200}}
        />
      </div>
    </div>
  );
}
