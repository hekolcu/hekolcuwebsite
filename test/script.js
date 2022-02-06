import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from './OrbitControl.js';

$(function () {
    let camera, scene, renderer, controls;
    let geometry, material;
    let mainMesh, mainMeshs = [];

    let systems = [{mainMesh: null, mainMeshs: []}];

    let camSpeed = 0, camSpeedIntervals = [];

    init();

    function init() {

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 100);
        camera.position.z = 0.2;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // main system init
        geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        material = new THREE.MeshNormalMaterial();
        mainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.075), new THREE.MeshBasicMaterial());
        scene.add(mainMesh);

        for (let i = 0; i < 50; i++)
            scene.add(meshInit(mainMeshs[mainMeshs.push(new THREE.Mesh(geometry, material)) - 1]));

        for (let i = 1; i <= 100; i++)
            systems[i] = {...systems[0]};
        
        // all systems init
        systems.forEach(o => {
            o.mainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.075), new THREE.MeshBasicMaterial());
            meshInit(o.mainMesh);
            o.mainMesh.position.multiplyScalar(10);
            o.mainMesh.lookAt(mainMesh.position);
            scene.add(o.mainMesh);
            for (let i = 0; i < 50; i++){
                scene.add(meshInit(o.mainMeshs[o.mainMeshs.push(new THREE.Mesh(geometry, material)) - 1]));
                o.mainMeshs[o.mainMeshs.length - 1].position.x += o.mainMesh.position.x;
                o.mainMeshs[o.mainMeshs.length - 1].position.y += o.mainMesh.position.y;
                o.mainMeshs[o.mainMeshs.length - 1].position.z += o.mainMesh.position.z;
                o.mainMeshs[o.mainMeshs.length - 1].lookAt(o.mainMesh.position);
            }
        });

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animation);
        document.body.appendChild(renderer.domElement);
        renderer.domElement.id = "main";

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
        controls.minDistance = 0.2;
        controls.maxDistance = 10;
        controls.enableDamping = true;
        controls.dampingFactor = 0.01;
        controls.enablePan = false;

        camSpeedIntervals.push(setInterval(function () {
            camSpeed += 0.0001;
            if (camSpeed >= 0.0025) {
                camSpeedIntervals.forEach(element => { clearInterval(element); });
                camSpeed = 0.0025;
            }
        }, 100));

    }

    function meshInit(m) {
        do {
            m.position.x = Math.random() - 0.5;
            m.position.y = Math.random() - 0.5;
            m.position.z = Math.random() - 0.5;
        } while (m.position.distanceTo(mainMesh.position) < 0.2 || m.position.distanceTo(mainMesh.position) > 0.5);
        m.lookAt(mainMesh.position);
        return m;
    }

    function animation(time) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), camSpeed);
        camera.lookAt(mainMesh.position);
        mainMesh.lookAt(camera.position);
        controls.update();
        renderer.render(scene, camera);
    }

    $("#main").on("mousedown", function (e) {
        // mainMeshs.forEach(m => { m.lookAt(camera.position); });
        camSpeed = 0;
        camSpeedIntervals.forEach(element => { clearInterval(element); });
        $(this).on("mousemove", function (mouseEvent) {
            // mainMeshs.forEach(m => { m.lookAt(camera.position); });// too much?
            camSpeedIntervals.forEach(element => { clearInterval(element); });
            camSpeed = 0;
        });
    }).on("mouseup mouseleave", function (e) {
        // mainMeshs.forEach(m => { m.lookAt(mesh.position); });
        camSpeedIntervals.forEach(element => { clearInterval(element); });
        setTimeout(() => {// find another way to do this
            camSpeedIntervals.forEach(element => { clearInterval(element); });
            camSpeedIntervals.push(setInterval(function () {
                camSpeed += 0.0001;
                if (camSpeed >= 0.0025) {
                    camSpeedIntervals.forEach(element => { clearInterval(element); });
                    camSpeedIntervals = [];
                    camSpeed = 0.0025;
                }
            }, 100));
        }, 1000);
        $(this).unbind("mousemove");
    });
});