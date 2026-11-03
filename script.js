import * as THREE from "three";

/* =================================
   BASIC THREE.JS SETUP
================================= */

const canvas = document.querySelector("#space");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);


/* =================================
   LIGHTING
================================= */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.3
);

scene.add(ambientLight);

const cyanLight = new THREE.PointLight(
    0x00f5ff,
    45,
    30
);

cyanLight.position.set(4, 3, 5);

scene.add(cyanLight);

const purpleLight = new THREE.PointLight(
    0x8b5cf6,
    35,
    30
);

purpleLight.position.set(-4, -2, 3);

scene.add(purpleLight);


/* =================================
   3D PLANET
================================= */

const planetGeometry = new THREE.SphereGeometry(
    1.5,
    64,
    64
);

const planetMaterial = new THREE.MeshStandardMaterial({

    color: 0x102b72,

    metalness: 0.65,

    roughness: 0.3,

    emissive: 0x071a55,

    emissiveIntensity: 0.7

});

const planet = new THREE.Mesh(
    planetGeometry,
    planetMaterial
);

// Move planet to the right
planet.position.set(2.5, 0, 0);

scene.add(planet);


/* =================================
   PLANETARY RINGS
================================= */

const ring1Geometry = new THREE.TorusGeometry(
    2.1,
    0.025,
    16,
    150
);

const ring1Material = new THREE.MeshBasicMaterial({

    color: 0x00f5ff,

    transparent: true,

    opacity: 0.9

});

const ring1 = new THREE.Mesh(
    ring1Geometry,
    ring1Material
);

ring1.position.x = 2.5;

ring1.rotation.x = 1.15;

ring1.rotation.y = 0.2;

scene.add(ring1);


const ring2Geometry = new THREE.TorusGeometry(
    2.5,
    0.015,
    16,
    150
);

const ring2Material = new THREE.MeshBasicMaterial({

    color: 0xa855f7,

    transparent: true,

    opacity: 0.9

});

const ring2 = new THREE.Mesh(
    ring2Geometry,
    ring2Material
);

ring2.position.x = 2.5;

ring2.rotation.x = 1.3;

ring2.rotation.y = 0.4;

scene.add(ring2);


/* =================================
   SMALL ORBITAL OBJECTS
================================= */

const satelliteGeometry = new THREE.IcosahedronGeometry(
    0.12,
    1
);

const satelliteMaterial = new THREE.MeshStandardMaterial({

    color: 0x00f5ff,

    emissive: 0x00aabb,

    emissiveIntensity: 1

});

const satellites = [];

for (let i = 0; i < 5; i++) {

    const satellite = new THREE.Mesh(
        satelliteGeometry,
        satelliteMaterial.clone()
    );

    const angle = (i / 5) * Math.PI * 2;

    satellite.position.set(
        2.5 + Math.cos(angle) * 2.8,
        Math.sin(angle) * 2.8,
        0
    );

    scene.add(satellite);

    satellites.push(satellite);

}


/* =================================
   FLOATING STARS
================================= */

const starGeometry = new THREE.BufferGeometry();

const starPositions = [];

for (let i = 0; i < 1800; i++) {

    starPositions.push(

        (Math.random() - 0.5) * 100,

        (Math.random() - 0.5) * 100,

        (Math.random() - 0.5) * 100

    );

}

starGeometry.setAttribute(

    "position",

    new THREE.Float32BufferAttribute(
        starPositions,
        3
    )

);

const starMaterial = new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.055,

    transparent: true,

    opacity: 0.85

});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);


/* =================================
   MOUSE MOVEMENT
================================= */

let mouseX = 0;

let mouseY = 0;

window.addEventListener("mousemove", (event) => {

    mouseX =
        (event.clientX / window.innerWidth - 0.5) * 2;

    mouseY =
        (event.clientY / window.innerHeight - 0.5) * 2;

});


/* =================================
   TOUCH MOVEMENT
================================= */

window.addEventListener("touchmove", (event) => {

    if (!event.touches.length) return;

    mouseX =
        (event.touches[0].clientX / window.innerWidth - 0.5) * 2;

    mouseY =
        (event.touches[0].clientY / window.innerHeight - 0.5) * 2;

}, { passive: true });


/* =================================
   SCROLL INTERACTION
================================= */

let scrollProgress = 0;

window.addEventListener("scroll", () => {

    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

    scrollProgress = maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;

});


/* =================================
   CLICKABLE PLANET
================================= */

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const planetColors = [

    0x102b72,

    0x5b21b6,

    0x087e8b,

    0x243b80,

    0x7c2d91

];

let colorIndex = 0;

let planetTargetScale = 1;

window.addEventListener("click", (event) => {

    pointer.x =
        (event.clientX / window.innerWidth) * 2 - 1;

    pointer.y =
        -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObject(planet);

    if (intersects.length > 0) {

        colorIndex =
            (colorIndex + 1) % planetColors.length;

        planet.material.color.setHex(
            planetColors[colorIndex]
        );

        planet.material.emissive.setHex(
            planetColors[colorIndex]
        );

        planetTargetScale =
            planetTargetScale === 1 ? 1.12 : 1;

    }

});


/* =================================
   RESPONSIVE PLANET POSITION
================================= */

function updatePlanetLayout() {

    if (window.innerWidth <= 650) {

        planet.position.x = 1.8;

        ring1.position.x = 1.8;

        ring2.position.x = 1.8;

        satellites.forEach((satellite) => {
            satellite.visible = false;
        });

    } else {

        planet.position.x = 2.5;

        ring1.position.x = 2.5;

        ring2.position.x = 2.5;

        satellites.forEach((satellite) => {
            satellite.visible = true;
        });

    }

}

updatePlanetLayout();


/* =================================
   ANIMATION LOOP
================================= */

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Planet rotation
    planet.rotation.y += 0.002;

    planet.rotation.x += 0.0005;

    // Smooth scale animation
    planet.scale.lerp(
        new THREE.Vector3(
            planetTargetScale,
            planetTargetScale,
            planetTargetScale
        ),
        0.05
    );

    // Ring animation
    ring1.rotation.z += 0.002;

    ring2.rotation.z -= 0.0015;

    // Satellite movement
    satellites.forEach((satellite, index) => {

        const angle =
            elapsedTime * 0.5 + index * 1.25;

        satellite.position.x =
            planet.position.x + Math.cos(angle) * 2.8;

        satellite.position.y =
            Math.sin(angle) * 2.8;

    });

    // Star rotation
    stars.rotation.y += 0.00015;

    stars.rotation.x += 0.00005;

    // Camera movement
    const targetCameraX = mouseX * 0.45;

    const targetCameraY =
        -mouseY * 0.35 - scrollProgress * 0.45;

    camera.position.x +=
        (targetCameraX - camera.position.x) * 0.025;

    camera.position.y +=
        (targetCameraY - camera.position.y) * 0.025;

    // Scroll-based planet movement
    planet.position.y =
        -scrollProgress * 0.8 +
        Math.sin(elapsedTime) * 0.04;

    ring1.position.y = planet.position.y;

    ring2.position.y = planet.position.y;

    // Camera focus
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

}


/* =================================
   WINDOW RESIZE
================================= */

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    updatePlanetLayout();

});


/* =================================
   START EXPERIENCE
================================= */

animate();

console.log("CYBORG 3D EXPERIENCE INITIALIZED");
