
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =====================================
   ELMUTIRI | SCHOOL 3D EXPERIENCE
   مدرسة العمدة
===================================== */

const canvas = document.getElementById("school3D");

if (canvas) {
    try {
        const scene = new THREE.Scene();
        scene.background = null;
        scene.fog = new THREE.Fog(0x102542, 20, 65);

        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(12, 8, 19);
        camera.lookAt(0, 2.2, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "low-power"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        const school = new THREE.Group();
        scene.add(school);

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xd8dfeb,
            roughness: 0.82,
            metalness: 0.04
        });

        const darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x17375c,
            roughness: 0.65,
            metalness: 0.15
        });

        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xd6b36a,
            roughness: 0.35,
            metalness: 0.45
        });

        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0x5794c9,
            emissive: 0x102c49,
            emissiveIntensity: 0.35,
            roughness: 0.22,
            metalness: 0.25
        });

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x172b43,
            roughness: 0.9,
            metalness: 0.05
        });

        function addBox(parent, width, height, depth, material, x, y, z) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(x, y, z);
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            parent.add(mesh);
            return mesh;
        }

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(60, 60),
            groundMaterial
        );

        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.08;
        scene.add(ground);

        // Main school structure
        addBox(school, 12, 0.3, 6, darkMaterial, 0, 0.12, 0);
        addBox(school, 10.8, 3.5, 4.8, wallMaterial, 0, 2.0, 0);
        addBox(school, 11.2, 0.22, 5.1, goldMaterial, 0, 3.86, 0);
        addBox(school, 11.0, 0.2, 5.0, darkMaterial, 0, 4.08, 0);
        addBox(school, 3.3, 1.25, 3.0, wallMaterial, 0, 4.75, -0.2);
        addBox(school, 3.5, 0.16, 3.15, goldMaterial, 0, 5.43, -0.2);

        // Entrance
        addBox(school, 1.55, 2.2, 0.15, darkMaterial, 0, 1.38, 2.43);
        addBox(school, 1.9, 0.14, 0.22, goldMaterial, 0, 2.56, 2.5);

        for (const x of [-1.15, 1.15]) {
            addBox(school, 0.18, 2.4, 0.2, goldMaterial, x, 1.35, 2.62);
        }

        const windowPositions = [
            [-4.1, 2.65],
            [-2.75, 2.65],
            [-1.8, 2.65],
            [1.8, 2.65],
            [2.75, 2.65],
            [4.1, 2.65],
            [-4.1, 1.15],
            [-2.75, 1.15],
            [2.75, 1.15],
            [4.1, 1.15]
        ];

        for (const [x, y] of windowPositions) {
            addBox(school, 0.72, 0.78, 0.08, glassMaterial, x, y, 2.44);
            addBox(school, 0.82, 0.06, 0.11, goldMaterial, x, y + 0.43, 2.47);
            addBox(school, 0.82, 0.06, 0.11, darkMaterial, x, y - 0.43, 2.47);
            addBox(school, 0.045, 0.78, 0.11, goldMaterial, x, y, 2.49);
        }

        for (const x of [-5.25, 5.25]) {
            addBox(school, 0.08, 3.5, 0.1, goldMaterial, x, 2.0, 2.45);
        }

        // Walkway
        addBox(school, 2.4, 0.08, 5, darkMaterial, 0, 0.12, 5.2);

        for (let i = 0; i < 5; i++) {
            addBox(
                school,
                1.5, 0.025, 0.035,
                goldMaterial,
                0, 0.17, 3.5 + i * 0.75
            );
        }

        // Lighting
        scene.add(new THREE.HemisphereLight(0xddeaff, 0x17243b, 2.0));

        const mainLight = new THREE.DirectionalLight(0xffe7b7, 3.0);
        mainLight.position.set(-8, 12, 10);
        scene.add(mainLight);

        const blueLight = new THREE.PointLight(0x4289db, 24, 30);
        blueLight.position.set(8, 5, -5);
        scene.add(blueLight);

        // Floating golden particles
        const particleCount = 100;
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 30;
            particlePositions[i * 3 + 1] = Math.random() * 12;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
        }

        const particleGeometry = new THREE.BufferGeometry();

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xd6b36a,
            size: 0.045,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            depthWrite: false
        });

        const particles = new THREE.Points(
            particleGeometry,
            particleMaterial
        );

        scene.add(particles);

        // Responsive renderer
        function resizeScene() {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }

        const resizeObserver = new ResizeObserver(resizeScene);
        resizeObserver.observe(canvas);
        resizeScene();

        // Mouse interaction
        const clock = new THREE.Clock();
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let animationFrame = 0;
        let isRunning = false;

        const interactionSurface = canvas.parentElement || canvas;

        let targetPointerX = 0;
        let targetPointerY = 0;
        let smoothPointerX = 0;
        let smoothPointerY = 0;

        interactionSurface.addEventListener("pointermove", (event) => {
            if (reduceMotion.matches || event.pointerType === "touch") return;

            const bounds = interactionSurface.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;

            targetPointerX = THREE.MathUtils.clamp(
                ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
                -1,
                1
            );

            targetPointerY = THREE.MathUtils.clamp(
                ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
                -1,
                1
            );
        });

        interactionSurface.addEventListener("pointerleave", () => {
            targetPointerX = 0;
            targetPointerY = 0;
        });

        // Animation loop
        function renderScene() {
            if (!isRunning) return;

            animationFrame = requestAnimationFrame(renderScene);

            const time = clock.getElapsedTime();

            if (!reduceMotion.matches) {
                smoothPointerX += (targetPointerX - smoothPointerX) * 0.055;
                smoothPointerY += (targetPointerY - smoothPointerY) * 0.055;

                school.rotation.y =
                    Math.sin(time * 0.16) * 0.045 + smoothPointerX * 0.19;

                school.rotation.x = -smoothPointerY * 0.045;

                school.position.y =
                    Math.sin(time * 0.55) * 0.035;

                camera.position.x =
                    12 + Math.sin(time * 0.12) * 0.35 + smoothPointerX * 0.8;

                camera.position.y =
                    8 + Math.sin(time * 0.18) * 0.12 - smoothPointerY * 0.35;

                camera.lookAt(0, 2.2, 0);

                particles.rotation.y = time * 0.012;
                particles.position.y =
                    Math.sin(time * 0.25) * 0.08;
            }

            renderer.render(scene, camera);
        }

        function startScene() {
            if (isRunning || document.hidden || reduceMotion.matches) return;

            isRunning = true;
            clock.start();
            renderScene();
        }

        function stopScene() {
            isRunning = false;
            cancelAnimationFrame(animationFrame);
        }

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopScene();
            } else if (reduceMotion.matches) {
                renderer.render(scene, camera);
            } else {
                startScene();
            }
        });

        reduceMotion.addEventListener("change", () => {
            if (reduceMotion.matches) {
                stopScene();

                school.rotation.set(0, 0, 0);
                school.position.y = 0;

                targetPointerX = 0;
                targetPointerY = 0;
                smoothPointerX = 0;
                smoothPointerY = 0;

                particles.rotation.y = 0;
                particles.position.y = 0;

                camera.position.set(12, 8, 19);
                camera.lookAt(0, 2.2, 0);

                renderer.render(scene, camera);
            } else {
                startScene();
            }
        });

        if (reduceMotion.matches) {
            renderer.render(scene, camera);
        } else {
            startScene();
        }

        console.log("ELmutiri | School 3D initialized.");

    } catch (error) {
        console.error("تعذر تشغيل مشهد Three.js:", error);
    }
}

/* ==========================================
   ELMUTIRI | GLOBAL INTERACTIVE UI
========================================== */

(() => {
    const motion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

  
const selectors = [
    ".intro-card",
    ".principal-image",
    ".principal-content",
    ".person-card",
    ".person-photo",
    ".facility-card",
    ".gallery-item",
    ".student-card",
    ".student-photo",
    ".contact-box",
    ".developer-honor",
    ".developer-portrait",
    ".section-heading",
    ".hero-content"
];

    const cardSelector = selectors.join(", ");

    // Interactive styles
    const style = document.createElement("style");

    style.textContent = `
      .elmutiri-interactive {
        --el-x: 50%;
        --el-y: 50%;
        position: relative;
        isolation: isolate;
        transition:
          transform .28s ease,
          box-shadow .28s ease,
          filter .28s ease;
      }

      .elmutiri-interactive::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(
          260px circle at var(--el-x) var(--el-y),
          rgba(111,156,255,.17),
          transparent 75%
        );
        opacity: 0;
        pointer-events: none;
        transition: opacity .25s ease;
        z-index: 1;
      }

      .elmutiri-interactive > * {
        position: relative;
        z-index: 2;
      }

      @media (hover:hover) and (pointer:fine) {
        .elmutiri-interactive:hover {
          transform: translateY(-4px);
          box-shadow:
            0 14px 32px rgba(15,40,90,.15),
            0 0 18px rgba(80,140,255,.12);
        }

        .elmutiri-interactive:hover::after {
          opacity: 1;
        }

        .elmutiri-button:hover {
          filter: brightness(1.12);
        }

        .elmutiri-image img {
          transition: transform .35s ease;
        }

        .elmutiri-image:hover img {
          transform: scale(1.035);
        }
      }

      .elmutiri-button {
        transition:
          filter .2s ease,
          transform .2s ease;
      }

      .elmutiri-button:active {
        transform: scale(.97);
      }

      @media (prefers-reduced-motion:reduce) {
        .elmutiri-interactive,
        .elmutiri-interactive::after,
        .elmutiri-button,
        .elmutiri-image img {
          transition: none !important;
        }

        .elmutiri-interactive:hover,
        .elmutiri-button:active,
        .elmutiri-image:hover img {
          transform: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    const cards = document.querySelectorAll(cardSelector);

    cards.forEach((element) => {
        element.classList.add("elmutiri-interactive");

        element.addEventListener("pointermove", (event) => {
            if (motion.matches || event.pointerType === "touch") return;

            const bounds = element.getBoundingClientRect();

            element.style.setProperty(
                "--el-x",
                `${event.clientX - bounds.left}px`
            );

            element.style.setProperty(
                "--el-y",
                `${event.clientY - bounds.top}px`
            );
        });

        element.addEventListener("pointerleave", () => {
            element.style.removeProperty("--el-x");
            element.style.removeProperty("--el-y");
        });
    });

    document.querySelectorAll(
        "button, .btn, .primary-button, nav a"
    ).forEach((element) => {
        element.classList.add("elmutiri-button");
    });

    document.querySelectorAll(
        ".gallery-item, .image-card"
    ).forEach((element) => {
        element.classList.add("elmutiri-image");
    });

    console.log(
        `ELmutiri | Interactive UI enabled on ${cards.length} cards`
    );
})();
