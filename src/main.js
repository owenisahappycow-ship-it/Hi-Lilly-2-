import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const gltfLoader = new GLTFLoader();
//defines the variables that can be used to load boject files

let model1, model2, model3,model4,model5;
//initialize the models as independently callable models

//load model1 me
gltfLoader.load('Models/4_2_2026.glb', (gltf) => {
  model1 = gltf.scene;
  model1.scale.set(1,1,1);
  scene.add(model1);
});

//load model2 text
gltfLoader.load('Models/Hililly.glb', (gltf) => {
  model2 = gltf.scene;
  model2.scale.set(0.6,0.6,0.6);
  model2.position.set(1,-1,-2.5);
  model2.rotation.set(-Math.PI/2*(0.3),Math.PI/2*(1.4),0);

  //traverse model 2 to color it 
  model2.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xffffff); // red
      child.material.metalness = 0;
      child.material.roughness = 0.9;
    }
  });

  scene.add(model2);
});
let x= 0.3;

gltfLoader.load('Models/met a clown today.glb', (gltf) => {
  model3 = gltf.scene;
  model3.scale.set(1*x,1*x,0.5*x);
  model3.position.set(0.3,-1.3,0);
  model3.rotation.set(-Math.PI/2*(0.07),(1.4)*-Math.PI/2,0);

  //traverse model 2 to color it 
  model3.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xffffff); // red
      child.material.metalness = 0;
      child.material.roughness = 0.9;
    }
  });

  scene.add(model3);
});

let y = 1;
gltfLoader.load('Models/how are you.glb', (gltf) => {
  model4 = gltf.scene;
  model4.scale.set(1*y,1*y,0.5*y);
  model4.position.set(-3,-4,2.5);
  model4.rotation.set(-Math.PI/2*(0.07),0.8*-Math.PI/2,0);

  //traverse model 2 to color it 
  model4.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xffffff); // red
      child.material.metalness = 0;
      child.material.roughness = 0.9;
    }
  });

  
  scene.add(model4);
});

gltfLoader.load('Models/duck.glb', (gltf) => {
  model5 = gltf.scene;
  model5.scale.set(1,1,1);
  model5.position.set(-3,-4,2.5);
  model5.rotation.set(-Math.PI/2*(0.07),0.8*-Math.PI/2,0);

  //traverse model 2 to color it 
  model5.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0xffffff); // red
      child.material.metalness = 0;
      child.material.roughness = 0.9;
    }
  });

  
  scene.add(model5);
});

//initialize the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,1000);
const renderer = new THREE.WebGLRenderer({
   canvas: document.querySelector('#bg'),
   // identifies the canvas mentioned in index.html so that things are laid out according to that structure
});


renderer.setPixelRatio (window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//const geometry = new THREE.TorusGeometry(10,3,16,100)
//const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
//const torus = new THREE.Mesh(geometry, material);
//scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff,2)
pointLight.position.set(10,10,10,2)

const ambientLight = new THREE.AmbientLight(0xffffff,1);

//const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(pointLight, ambientLight);
//scene.add(gridHelper)

//scene.add(lightHelper)

//allows the camera to be moved by the mouse
const controls = new OrbitControls(camera, renderer.domElement);

//populate the scene with stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.05,24,24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff});
  const star = new THREE.Mesh (geometry, material)

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//adds background, currently not working
const loader = new THREE.TextureLoader();
loader.load(
  'spacetexure.jpg',
  (texture) => {
    scene.background = texture; // set background when texture loads
    console.log('Texture loaded successfully');
  },
  undefined,
  (err) => {
    console.error('Error loading texture:', err);
  }
);

let totalS = 0;
let targetS = 0;

function moveCamera(event) {
  targetS += event.deltaY;
}

document.addEventListener("wheel",moveCamera);

const audio = document.getElementById("backgroundMusic");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const track = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

track.connect(analyser);
analyser.connect(audioContext.destination);

// Configure analyser
analyser.fftSize = 256; // smaller = more coarse, larger = more precise
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

document.body.addEventListener("click", () => {
  audioContext.resume(); // activate AudioContext
  audio.play();
});

//animated counter
const debugEl = document.getElementById("debug");

function animate() {
  requestAnimationFrame(animate);

  // Music analysis
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
  const avg = sum / bufferLength;

  // Smooth music-driven scaling
  let modelScale = 0;
  modelScale += (avg - modelScale) * 0.05;
  if (model1) {
    model1.scale.set(1 + modelScale / 10, 1 + modelScale / 200, 1 + modelScale / 200);
    if (avg > 10000) { // adjust threshold for your music
    model1.position.y = Math.sin(Date.now() * 0.01) * 2;
    }
  }


  // Smooth scroll camera
  totalS += (targetS - totalS) * 0.1;
  camera.position.z = -4 + totalS * -0.01;
  camera.position.x = -1 + totalS * -0.0002;
  camera.position.y = -1 + totalS * -0.002;


debugEl.textContent = "Scroll: " + totalS.toFixed(2);

  if (totalS > -299) {
    model2.visible = true;
  } else {
    model2.visible = false;
  }
 
  if (totalS < -499 ) {
    model4.visible = true;
  } else {
    model4.visible = false;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate()