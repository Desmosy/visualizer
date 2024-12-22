import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Parameters
const params = {
  red: 1.0,
  green: 1.0,
  blue: 1.0,
  threshold: 0.5,
  strength: 0.4,
  radius: 0.8,
};

// Renderer settings
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Post-processing setup
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight)
);
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

// Camera position
camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

// Shader uniforms
const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_frequency: { type: 'f', value: 0.0 },
  u_red: { type: 'f', value: params.red },
  u_green: { type: 'f', value: params.green },
  u_blue: { type: 'f', value: params.blue },
};

// Material and geometry
const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: document.getElementById('vertexshader').textContent,
  fragmentShader: document.getElementById('fragmentshader').textContent,
});

const isMobile = window.innerWidth<=400;
const geo = new THREE.TorusGeometry(isMobile? 1: 2, 3, 8, 100);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
mesh.material.wireframe = true;


// camera.fov = isMobile ? 45 : 75;  // Smaller FOV for mobile
// camera.updateProjectionMatrix();


// Audio setup
let audioContext;
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
let analyser;
let audioStartTime = 0;

// Audio initialization function
function initializeAudio() {
  if (!audioContext) {
    audioContext = listener.context;
    analyser = new THREE.AudioAnalyser(sound, 32);
    
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('Beats.mp3', function(buffer) {
      sound.setBuffer(buffer);
      if (!sound.isPlaying) {
        sound.play();
        audioStartTime = audioContext.currentTime;
      }
    });
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// Click handler for audio
document.addEventListener('click', function() {
  initializeAudio();
}, { once: true });

// GUI setup
const gui = new GUI();

const colorsFolder = gui.addFolder('Colors');
colorsFolder.add(params, 'red', 0, 1).onChange(function(value) {
  uniforms.u_red.value = Number(value);
});
colorsFolder.add(params, 'green', 0, 1).onChange(function(value) {
  uniforms.u_green.value = Number(value);
});
colorsFolder.add(params, 'blue', 0, 1).onChange(function(value) {
  uniforms.u_blue.value = Number(value);
});

const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function(value) {
  bloomPass.threshold = Number(value);
});
bloomFolder.add(params, 'strength', 0, 3).onChange(function(value) {
  bloomPass.strength = Number(value);
});
bloomFolder.add(params, 'radius', 0, 1).onChange(function(value) {
  bloomPass.radius = Number(value);
});

// Mouse movement
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function(e) {
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  mouseX = (e.clientX - windowHalfX) / 100;
  mouseY = (e.clientY - windowHalfY) / 100;
});

const lyrics = [


  { time: 27, text: "ᑌh, me and my ****** tryna get it, ya bish (ya bish)" },
  { time: 31, text: "Hit the house lick, tell me is you wit' it, ya bish? (Ya bish)" },
  { time: 34.8, text: "Home invasion was persuasive (was persuasive)" },
  { time: 38, text: "From nine-to-five I know it’s vacant, ya bish (ya bish)" },
  { time: 41, text: "Dreams of living life like rappers do (like rappers do)" },
  { time: 45, text: "Back when c** wrappers wasn't cool (they wasn't cool)" },
  { time: 48, text: "I **** sherane and, went to tell my bros" },
  { time: 49, text: "Tell my bros, tell my bros" },
  { time: 51, text: "Ƭhen ᑌsher ᖇaymond “Ꮮet Ⲓt ᗷurn” came on (“Ꮮet ᗷurn” came on)" },
  { time: 54, text: "ᕼot sauce all in our Ƭop ᖇamen, ya bish (ya bish)" },
  { time: 57, text: "Park the car, then we start rhyming, ya bish" },
  { time: 61, text: "Ƭhe only thing we had to free our mind (free our mind)" },
  { time: 65, text: "Ƭhen freeze that verse when we see dollar signs (see dollar signs)" },
  { time: 67, text: "Ƴou looking like an easy come up, ya bish (ya bish)" },
  { time: 71, text: " Ꭺ silver spoon Ⲓ know you come from, ya bish (ya bish)" },
  { time: 74, text: " Ꭺnd that’s a lifestyle that we never knew (we never knew)" },
  { time: 77, text: " Ꮆo at a reverend for the revenue" },
  { time: 78.9, text: "Ⲓt go ᕼalle ᗷerry or hallelujah Ꮲick your poison, tell me what you doing" },
  { time: 87, text: "Ꭼverybody gon’ respect the shooter ᗷut the one in front of the gun lives forever" },
  { time: 93, text: " (Ƭhe one in front of the gun, forever)" },
  { time: 97, text: " Ꭺnd Ⲓ been hustling all day, this-a-way, that-a-way  Ƭhrough canals and alleyways, just to say " },
  { time: 104, text: " Ꮇoney trees is the perfect place for shade and that’s just how Ⲓ feel" },
  { time: 107, text: "Ⲛah, nah, a dollar might just **** your main *****, that’s just how Ⲓ feel" },
  { time: 111.9, text: " Ⲛah, a dollar might say **** them ****** that you came with, that’s just how Ⲓ feel" },
  { time: 121, text: " Ⲛah, nah, a dollar might just make that lane switch, that’s just how Ⲓ feel" },
  { time: 127.8, text: " Ⲛah, a dollar might turn to a million and we all rich, that’s just how Ⲓ feel" },
  { time: 134, text: "ᗪreams of living life like rappers do (like rappers do)" },
  { time: 138, text: "ᗷump that new Ꭼ-40 after school (way after school) Ƴou know “ᗷig ᗷallin’ Ꮃith Ꮇy ᕼomies” (my homies) Ꭼarl Տtevens had us thinkin’ rational (thinkin’ rational)" },
  { time: 147, text: "ᗷack to reality, we poor, ya bish (ya bish)" },
  { time: 152, text: "Contd.. Money Trees-Kendrick Lamar" },
  { time: 160, text: "@koshish" },

];

const lyricsDisplay = document.getElementById("lyrics-display");
let currentLine = 0;

function updateLyrics() {
  if (sound && sound.isPlaying) {
    const currentTime = audioContext.currentTime - audioStartTime;
    
    while (currentLine < lyrics.length && currentTime >= lyrics[currentLine].time) {
      lyricsDisplay.textContent = lyrics[currentLine].text;
      currentLine++;
    }
  }
}

// Animation
const clock = new THREE.Clock();

function animate() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.5;
  camera.lookAt(scene.position);
  uniforms.u_time.value = clock.getElapsedTime();
  
  if (analyser) {
    uniforms.u_frequency.value = analyser.getAverageFrequency();
  }
  
  updateLyrics();
  bloomComposer.render();
  requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerWidth <= 400) {
    mesh.scale.set(0.5, 0.5, 0.5);  // Scale down geometry for mobile
  } else {
    mesh.scale.set(1, 1, 1);  // Default size for desktop
  }

});

// Handle audio ending
sound.onEnded = function() {
  lyricsDisplay.textContent = "Lyrics will appear here...";
  currentLine = 0;
};