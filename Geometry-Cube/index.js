import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';


const w = window.innerWidth;
const h = window.innerHeight;
 const renderer = new THREE.WebGLRenderer({ antialias: true });
 renderer.setSize(w, h);
 document.body.appendChild(renderer.domElement);

 const fov = 75;
 const aspect = w / h;
 const near = 0.1;
 const far =10;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geo = new THREE.BoxGeometry(1,1,1);
const mat = new THREE.LineDashedMaterial({
    color: 0x0099ff,
    linewidth: 1,
    scale: 1,
    dashSize: 3,
    gapSize: 1,
});
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);


const light = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(light);

function animate(t = 0) {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    controls.update();
    
}

animate();
