import * as THREE from 'three';
import { GUI } from 'lil-gui'; // Import lil-gui instead of dat.gui
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';




const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const params = {
  red: 1.0,
  green: 1.0,
  blue: 1.0,
  threshold: 0.5,
  strength: 0.4,
  radius: 0.8,
};

renderer.outputColorSpace = THREE.SRGBColorSpace;

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

camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_frequency: { type: 'f', value: 0.0 },
  u_red: { type: 'f', value: params.red },
  u_green: { type: 'f', value: params.green },
  u_blue: { type: 'f', value: params.blue },
};

const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: document.getElementById('vertexshader').textContent,
  fragmentShader: document.getElementById('fragmentshader').textContent,
});

const geo = new THREE.TorusGeometry( 2, 3, 8, 100 );
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
mesh.material.wireframe = true;


const audioContext = new (window.AudioContext || window.webkitAudioContext)();

document.addEventListener('click', function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully');
        });
    }
});

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
sound.hasPlaybackControl = true;

const audioLoader = new THREE.AudioLoader();
audioLoader.load('Beats.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5)

    document.getElementById('playButton').addEventListener('click', function () {
        audioContext.resume().then(() => {
            sound.play();
        });
    });
});


const analyser = new THREE.AudioAnalyser(sound, 32);
const gui = new GUI(); // Create a new GUI instance

// Create the UI to control colors
const colorsFolder = gui.addFolder('Colors');
colorsFolder.add(params, 'red', 0, 1).onChange(function (value) {
  uniforms.u_red.value = Number(value);
});
colorsFolder.add(params, 'green', 0, 1).onChange(function (value) {
  uniforms.u_green.value = Number(value);
});
colorsFolder.add(params, 'blue', 0, 1).onChange(function (value) {
  uniforms.u_blue.value = Number(value);
});

// Create the UI to control bloom properties
const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function (value) {
  bloomPass.threshold = Number(value);
});
bloomFolder.add(params, 'strength', 0, 3).onChange(function (value) {
  bloomPass.strength = Number(value);
});
bloomFolder.add(params, 'radius', 0, 1).onChange(function (value) {
  bloomPass.radius = Number(value);
});

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function (e) {
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  mouseX = (e.clientX - windowHalfX) / 100;
  mouseY = (e.clientY - windowHalfY) / 100;
});





const clock = new THREE.Clock();
function animate() {
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.5;
  camera.lookAt(scene.position);
  uniforms.u_time.value = clock.getElapsedTime();
  uniforms.u_frequency.value = analyser.getAverageFrequency();
  bloomComposer.render();
  requestAnimationFrame(animate);
}
animate();



window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
});

const audioElement = document.getElementById('audioElement');
//sound.setMediaElementSource(audioElement);

// window.addEventListener('click', function () {
//   audioElement.play();
// });


// Define the lyrics
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


// Get references to elements
const lyricsDisplay = document.getElementById("lyrics-display");

let currentLine = 0;

// Sync lyrics with audio playback
audioElement.addEventListener("timeupdate", () => {
  const currentTime = audioElement.currentTime;

  // Check if we need to update the displayed lyric
  if (currentLine < lyrics.length && currentTime >= lyrics[currentLine].time) {
    lyricsDisplay.textContent = lyrics[currentLine].text;
    currentLine++;
  }
});

// Reset the lyrics when the audio ends or restarts
audioElement.addEventListener("ended", () => {
  lyricsDisplay.textContent = "Lyrics will appear here...";
  currentLine = 0;
});

audioElement.addEventListener("seeked", () => {
  // If the user seeks backward, reset to the correct lyric
  currentLine = lyrics.findIndex((lyric) => lyric.time > audioElement.currentTime);
  if (currentLine === -1) {
    currentLine = lyrics.length;
  }
});


