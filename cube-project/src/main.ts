import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  100
);

camera.position.z = 8;
camera.position.y = 3;
camera.position.x = 3;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0xf2821f });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;

scene.add(cube);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x339139, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -Math.PI / 2;
plane.position.y = -cube.geometry.parameters.height / 2;

plane.receiveShadow = true;

scene.add(plane);

const sunLight = new THREE.DirectionalLight();
scene.add(sunLight);
sunLight.castShadow = true;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;

colorPicker.addEventListener('input', (event) => {
  const color = (event.target as HTMLInputElement).value;
  (cube.material as THREE.MeshStandardMaterial).color.set(color);
});

//Simulate a day cycle by moving the sun around the scene

let time = Math.PI / 2; // Start at midday for better initial lighting

function animate() {
  requestAnimationFrame(animate);

  time += 0.001;
  
  if (time > Math.PI) {
    time = 0; 
  }

  const radius = 10;

  sunLight.position.set(radius * Math.cos(time), radius * Math.sin(time), 5);

  // Intensity based on the height of the sun, with a minimum to avoid complete darkness
  const intensity = Math.max(0.3, Math.sin(time));
  sunLight.intensity = intensity;

  // Color changes from warm at sunrise/sunset to cool at midday
  const color = new THREE.Color();
  const normalized = Math.max(0, Math.sin(time));

  color.setRGB(
    1,                       // Red remains constant
    0.5 + normalized * 0.5,  // Green increases towards midday
    0.5 + (1 - normalized) * 0.5 // Blue decreases towards midday
  );

  sunLight.color = color;

  controls.update();

  renderer.render(scene, camera);
}

animate();