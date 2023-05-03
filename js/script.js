import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from './libs/three/OrbitControl.js';
$(function () {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    function generateSystem() {
        const system = new THREE.Group();

        const centerCubeSize = 2;
        const otherCubeSize = 1;
        const cubeDistance = 2;

        const centerCube = new THREE.Mesh(new THREE.BoxGeometry(centerCubeSize, centerCubeSize, centerCubeSize), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        system.add(centerCube);

        const numOtherCubes = Math.floor(Math.random() * 49) + 1;
        for (let i = 0; i < numOtherCubes; i++) {
            const otherCube = new THREE.Mesh(new THREE.BoxGeometry(otherCubeSize, otherCubeSize, otherCubeSize), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            let positionFound = false;
            while (!positionFound) {
                const x = Math.random() * cubeDistance * 2 - cubeDistance;
                const y = Math.random() * cubeDistance * 2 - cubeDistance;
                const z = Math.random() * cubeDistance * 2 - cubeDistance;
                const distanceToCenter = Math.sqrt(x * x + y * y + z * z);
                if (distanceToCenter > centerCubeSize / 2 && !system.children.some(cube => cube.position.distanceTo(new THREE.Vector3(x, y, z)) < otherCubeSize * 2)) {
                    otherCube.position.set(x, y, z);
                    system.add(otherCube);
                    positionFound = true;
                }
            }
        }

        return system;
    }

    for (let i = 0; i < 50; i++) {
        let systemPositionFound = false;
        const system = generateSystem();
        while (!systemPositionFound) {
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 100 - 50;
            const z = Math.random() * 100 - 50;
            if (!scene.children.some(system => system.position.distanceTo(new THREE.Vector3(x, y, z)) < 10)) {
                system.position.set(x, y, z);
                scene.add(system);
                systemPositionFound = true;
            }
        }
    }

    const renderer = new THREE.WebGLRenderer();
    // ...

    renderer.domElement.addEventListener('click', event => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0 && intersects[0].object.parent) {
            const system = intersects[0].object.parent;
            const centerCube = system.children.find(cube => cube.geometry.parameters.width === 4);
            if (centerCube) {
                const controls = new OrbitControls(camera, renderer.domElement);
                controls.target.set(centerCube.getWorldPosition(new THREE.Vector3()));
            }
        }
    });
});
