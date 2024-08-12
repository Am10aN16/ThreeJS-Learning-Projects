import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import spline from './spline.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w,h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 3.5;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

//create a line geometry from the spline
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(geometry, material);
// scene.add(line);


//create a tube geometry from the spline
const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, false);


//create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeometry, 0.2);
const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xfff00 });
const edgesLine = new THREE.LineSegments(edges, edgesMaterial);
scene.add(edgesLine);

const numBoxes = 55;
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
for(let i = 0; i < numBoxes; i+= 1){
    const boxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const box = new THREE.Mesh(boxGeo, boxMat);
    const p = (i / numBoxes + Math.random() * 0.1) % 1;
    const pos  = tubeGeometry.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.z += Math.random() - 0.4;
    box.position.copy(pos);
    const rote = new THREE.Vector3(
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
    );
    box.rotation.set(rote.x, rote.y, rote.z);
   const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
   const color = new THREE.Color().setHSL(1.0 - p, 1, 0.5);
    const edgesMaterial = new THREE.LineBasicMaterial({ color });
    const boxLines = new THREE.LineSegments(edges, edgesMaterial);
    boxLines.position.copy(pos);
    boxLines.rotation.set(rote.x, rote.y, rote.z);
    scene.add(boxLines);
}

function updateCamera(t) {
 const time = t * 0.1;
 const looptime = 6 * 1000;
 const p = (time % looptime) / looptime;
 const pos = tubeGeometry.parameters.path.getPointAt(p);
 const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
 camera.position.copy(pos);
 camera.lookAt(lookAt);
}

function animate(t = 0) {
    requestAnimationFrame(animate);
    updateCamera(t);
    composer.render(scene, camera);
    boxLines.rotation.x += 0.58;
    boxLines.rotation.y += 0.51;
    boxLines.rotation.z += 0.3;
    controls.update();

}

animate();
