import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

export function loadSVG(
  url: string,
  loadingManager: THREE.LoadingManager
): THREE.Group {
  const group = new THREE.Group();
  group.scale.multiplyScalar(10.0);
  group.position.x = 0;
  group.position.y = 0;
  group.scale.y *= -1;

  //const loader = new SVGLoader();
  const loader = new SVGLoader(loadingManager);

  loader.load(url, function (data: any) {
    const paths = data.paths;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      const fillColor = path.userData.style.fill;
      if (true && fillColor !== undefined && fillColor !== 'none') {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(fillColor),
          //  opacity: path.userData.style.fillOpacity,
          opacity: 1.0,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          wireframe: true,
        });

        const shapes = path.toShapes(true);

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];

          const geometry = new THREE.ShapeBufferGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);

          group.add(mesh);
        }
      }

      const strokeColor = path.userData.style.stroke;

      if (true && strokeColor !== undefined && strokeColor !== 'none') {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setStyle(strokeColor),
          // opacity: path.userData.style.strokeOpacity,
          opacity: 0.7,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          wireframe: false,
        });

        for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
          const subPath = path.subPaths[j];

          const geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData.style
          );

          if (geometry) {
            const mesh = new THREE.Mesh(geometry, material);

            group.add(mesh);
          }
        }
      }
    }
  });
  return group;
}
