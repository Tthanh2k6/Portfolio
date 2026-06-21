import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

// ═══════════════════════════════════════════════════════════════════
// CẤU HÌNH — giữ nguyên giá trị từ neon-grid-demo.html
// ═══════════════════════════════════════════════════════════════════
const VISIBLE_GRID_SIZE = 20;
const GRID_SIZE         = 38;
const CUBE_SIZE         = 6.2;
const GRID_SPACING      = 10.2;
const MIN_H             = 0.10;
const MAX_H             = 6.0;
const HOVER_R           = 15.0;
const LERP_IN           = 0.16;
const LERP_OUT          = 0.055;
const BG_OPA            = 0.06;
const BG_ARM            = 1.60;
const FOG_START         = 40.0;
const FOG_END           = 95.0;
const LINE_THICKNESS    = 3.8;
const BLOOM_STRENGTH    = 1.1;
const BLOOM_RADIUS      = 0.38;
const BLOOM_THRESHOLD   = 0.15;
const BASE_H            = 0.15;
const IDLE_MS           = 3000;
const CAMERA_Y_OFFSET   = 20;

const C_PINK   = new THREE.Color("#FF00FF");
const C_PURPLE = new THREE.Color("#9900FF");
const C_CYAN   = new THREE.Color("#00FFFF");
const C_ORANGE = new THREE.Color("#FF6B6B");
const C_YELLOW = new THREE.Color("#4A0E17");

function neonColor(t: number): THREE.Color {
  const c = new THREE.Color();
  if (t < 0.5) return c.lerpColors(C_PINK, C_PURPLE, t * 2);
  return c.lerpColors(C_PURPLE, C_CYAN, (t - 0.5) * 2);
}

function warmColor(t: number): THREE.Color {
  return new THREE.Color().lerpColors(C_ORANGE, C_YELLOW, t);
}

// ─── Component ────────────────────────────────────────────────────
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load custom colors from localStorage or fallback to defaults
    const pinkHex = localStorage.getItem("home_cube_pink") || "#FF00FF";
    const purpleHex = localStorage.getItem("home_cube_purple") || "#9900FF";
    const cyanHex = localStorage.getItem("home_cube_cyan") || "#00FFFF";
    const orangeHex = localStorage.getItem("home_cube_orange") || "#FF6B6B";
    const yellowHex = localStorage.getItem("home_cube_yellow") || "#4A0E17";

    const cPink = new THREE.Color(pinkHex);
    const cPurple = new THREE.Color(purpleHex);
    const cCyan = new THREE.Color(cyanHex);
    const cOrange = new THREE.Color(orangeHex);
    const cYellow = new THREE.Color(yellowHex);

    // Load custom scene variables from localStorage or fallback to defaults
    const visibleGridSize = parseFloat(localStorage.getItem("scene_visible_grid_size") || "20");
    const gridSize         = parseInt(localStorage.getItem("scene_grid_size") || "38");
    const cubeSize         = parseFloat(localStorage.getItem("scene_cube_size") || "6.2");
    const gridSpacing      = parseFloat(localStorage.getItem("scene_grid_spacing") || "10.2");
    const minH             = parseFloat(localStorage.getItem("scene_min_h") || "0.10");
    const maxH             = parseFloat(localStorage.getItem("scene_max_h") || "6.0");
    const hoverR           = parseFloat(localStorage.getItem("scene_hover_r") || "15.0");
    const lerpIn           = parseFloat(localStorage.getItem("scene_lerp_in") || "0.16");
    const lerpOut          = parseFloat(localStorage.getItem("scene_lerp_out") || "0.055");
    const bgOpa            = parseFloat(localStorage.getItem("scene_bg_opa") || "0.06");
    const bgArm            = parseFloat(localStorage.getItem("scene_bg_arm") || "1.60");
    const fogStart         = parseFloat(localStorage.getItem("scene_fog_start") || "40.0");
    const fogEnd           = parseFloat(localStorage.getItem("scene_fog_end") || "95.0");
    const lineThickness    = parseFloat(localStorage.getItem("scene_line_thickness") || "3.8");
    const bloomStrength    = parseFloat(localStorage.getItem("scene_bloom_strength") || "1.1");
    const bloomRadius      = parseFloat(localStorage.getItem("scene_bloom_radius") || "0.38");
    const bloomThreshold   = parseFloat(localStorage.getItem("scene_bloom_threshold") || "0.15");
    const baseH            = parseFloat(localStorage.getItem("scene_base_h") || "0.15");
    const idleMs           = parseFloat(localStorage.getItem("scene_idle_ms") || "3000");
    const cameraYOffset    = parseFloat(localStorage.getItem("scene_camera_y_offset") || "20");

    // Cube state & Scene advanced settings
    const cubeSolidColor    = localStorage.getItem("scene_cube_solid_color") || "#010101";
    const cubeMetalness     = parseFloat(localStorage.getItem("scene_cube_metalness") || "0.4");
    const cubeRoughness     = parseFloat(localStorage.getItem("scene_cube_roughness") || "0.5");
    const platformColor     = localStorage.getItem("scene_platform_color") || "#020202";
    const platformMetalness = parseFloat(localStorage.getItem("scene_platform_metalness") || "0.2");
    const platformRoughness = parseFloat(localStorage.getItem("scene_platform_roughness") || "0.6");
    const ambientColor      = localStorage.getItem("scene_ambient_color") || "#ffffff";
    const ambientIntensity  = parseFloat(localStorage.getItem("scene_ambient_intensity") || "0.04");
    const light1Intensity   = parseFloat(localStorage.getItem("scene_light1_intensity") || "1.5");
    const light2Intensity   = parseFloat(localStorage.getItem("scene_light2_intensity") || "1.5");
    const lightDecay        = parseFloat(localStorage.getItem("scene_light_decay") || "1.5");
    const lightDistanceFactor = parseFloat(localStorage.getItem("scene_light_distance_factor") || "2.5");
    const idleHeightSteps   = parseInt(localStorage.getItem("scene_idle_height_steps") || "5");
    const idleHeightMult    = parseFloat(localStorage.getItem("scene_idle_height_mult") || "1.1");
    const idleUpdateMin     = parseFloat(localStorage.getItem("scene_idle_update_min") || "600");
    const idleUpdateRand    = parseFloat(localStorage.getItem("scene_idle_update_rand") || "600");

    function getNeonColor(t: number): THREE.Color {
      const c = new THREE.Color();
      if (t < 0.5) return c.lerpColors(cPink, cPurple, t * 2);
      return c.lerpColors(cPurple, cCyan, (t - 0.5) * 2);
    }

    function getWarmColor(t: number): THREE.Color {
      return new THREE.Color().lerpColors(cOrange, cYellow, t);
    }

    // ── Renderer ───────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // ── Scene ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    // ── Camera Orthographic Isometric ──────────────────────────────
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    function updateCamera() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.left   = -w / 2;
      camera.right  =  w / 2;
      camera.top    =  h / 2 + cameraYOffset;
      camera.bottom = -h / 2 + cameraYOffset;
      camera.zoom   = Math.min(w, h) / (visibleGridSize * gridSpacing * 0.4);
      camera.updateProjectionMatrix();
    }

    // ── Post-processing: UnrealBloom ───────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomStrength,
      bloomRadius,
      bloomThreshold,
    );
    composer.addPass(bloomPass);

    // ── Lights ─────────────────────────────────────────────────────
    const hw = ((gridSize - 1) / 2) * gridSpacing;
    scene.add(new THREE.AmbientLight(ambientColor, ambientIntensity));
    const pinkLight = new THREE.PointLight(pinkHex, light1Intensity, hw * lightDistanceFactor, lightDecay);
    pinkLight.position.set(-fogStart, 8.0, fogStart);
    scene.add(pinkLight);
    const cyanLight = new THREE.PointLight(cyanHex, light2Intensity, hw * lightDistanceFactor, lightDecay);
    cyanLight.position.set(fogStart, 8.0, -fogStart);
    scene.add(cyanLight);

    // ── Dữ liệu lưới ──────────────────────────────────────────────
    type CubeData = {
      px: number; pz: number;
      color: THREE.Color;
      baseColor: THREE.Color;
      idleTargetH: number;
      nextUpdate: number;
    };
    const cubes: CubeData[] = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const t  = (x / (gridSize - 1) + z / (gridSize - 1)) / 2;
        const px = (x - (gridSize - 1) / 2) * gridSpacing;
        const pz = (z - (gridSize - 1) / 2) * gridSpacing;
        cubes.push({
          px, pz,
          color: getNeonColor(t).clone(),
          baseColor: getWarmColor(t).clone(),
          idleTargetH: minH + Math.floor(Math.random() * idleHeightSteps) * idleHeightMult,
          nextUpdate: performance.now() + Math.random() * 1000,
        });
      }
    }
    const N = cubes.length;

    // ── Lớp 1: Lưới nền dấu + (một geometry gộp chung) ────────────
    const bgPos: number[] = [];
    const bgCol: number[] = [];
    cubes.forEach(({ px, pz, color }) => {
      const d = Math.sqrt(px * px + pz * pz);
      const f = Math.max(0, Math.min(1, 1 - (d - fogStart) / (fogEnd - fogStart)));
      if (f <= 0) return;
      bgPos.push(
        px - bgArm, 0.01, pz,  px + bgArm, 0.01, pz,
        px, 0.01, pz - bgArm,  px, 0.01, pz + bgArm,
      );
      // Bake fogFactor vào vertex color để giả lập opacity per-cube
      for (let k = 0; k < 4; k++) bgCol.push(color.r * f, color.g * f, color.b * f);
    });
    const bgGeom = new THREE.BufferGeometry();
    bgGeom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(bgPos), 3));
    bgGeom.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(bgCol), 3));
    const bgMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: bgOpa, depthWrite: false,
    });
    scene.add(new THREE.LineSegments(bgGeom, bgMat));

    // ── Lớp 2: Geometry viền dày dùng chung (LineSegmentsGeometry) ─
    const half = cubeSize / 2;
    const edgePts: [number, number, number][] = [
      [-half, -0.5, -half], [half, -0.5, -half], [half, -0.5,  half], [-half, -0.5,  half],
      [-half,  0.5, -half], [half,  0.5, -half], [half,  0.5,  half], [-half,  0.5,  half],
    ];
    const edgePairs: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    const edgePos: number[]  = [];
    const edgeVcol: number[] = [];
    edgePairs.forEach(([a, b], idx) => {
      edgePos.push(...edgePts[a], ...edgePts[b]);
      const br = idx < 4 ? 1.0 : 0.65;
      edgeVcol.push(br, br, br,  br, br, br);
    });
    const edgesGeom = new LineSegmentsGeometry();
    edgesGeom.setPositions(edgePos);
    edgesGeom.setColors(edgeVcol);

    const boxGeom  = new THREE.BoxGeometry(cubeSize, 1, cubeSize);
    const baseGeom = new THREE.BoxGeometry(gridSpacing * 1.005, baseH, gridSpacing * 1.005);

    const groups:       THREE.Group[]                = [];
    const solidMats:    THREE.MeshStandardMaterial[] = [];
    const edgeMats:     LineMaterial[]               = [];
    const baseMeshMats: THREE.MeshBasicMaterial[]    = [];
    const heights    = new Float32Array(N).fill(minH);
    const opacities  = new Float32Array(N).fill(0);

    cubes.forEach(({ px, pz, baseColor }) => {
      // Bệ sàn
      const baseMat = new THREE.MeshBasicMaterial({
        color: baseColor, transparent: true, opacity: 0, depthWrite: false,
      });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      baseMesh.position.set(px, baseH / 2, pz);
      baseMesh.renderOrder = 1;
      scene.add(baseMesh);
      baseMeshMats.push(baseMat);

      // Thân cube (solid body + viền dày phát sáng)
      const group = new THREE.Group();
      group.position.set(px, minH * 0.5, pz);
      group.scale.y = minH;

      const solidMat = new THREE.MeshStandardMaterial({
        color: cubeSolidColor, metalness: cubeMetalness, roughness: cubeRoughness, transparent: true, opacity: 0,
      });
      group.add(new THREE.Mesh(boxGeom, solidMat));
      solidMats.push(solidMat);

      const edgeMat = new LineMaterial({
        color: "#FFD3B6",
        vertexColors: false,
        linewidth: lineThickness,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      edgeMat.resolution.set(window.innerWidth, window.innerHeight);
      group.add(new LineSegments2(edgesGeom, edgeMat));
      edgeMats.push(edgeMat);

      groups.push(group);
      scene.add(group);
    });

    // Mặt phẳng nền hấp thụ ánh sáng
    const platformGeom = new THREE.PlaneGeometry(hw * 2 + gridSpacing, hw * 2 + gridSpacing);
    const platformMat  = new THREE.MeshStandardMaterial({ color: platformColor, roughness: platformRoughness, metalness: platformMetalness });
    const platform     = new THREE.Mesh(platformGeom, platformMat);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -0.01;
    scene.add(platform);

    // ── Mouse tracking (trên window vì canvas pointer-events: none) ─
    const mouse3D    = new THREE.Vector3(99999, 0, 99999);
    let isActive     = false;
    let lastMoveTime = Date.now();

    const raycaster   = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const rayTarget   = new THREE.Vector3();

    const onMouseMove = (e: MouseEvent) => {
      raycaster.setFromCamera(
        new THREE.Vector2(
          (e.clientX / window.innerWidth)  *  2 - 1,
          (e.clientY / window.innerHeight) * -2 + 1,
        ),
        camera,
      );
      if (raycaster.ray.intersectPlane(groundPlane, rayTarget)) {
        mouse3D.copy(rayTarget);
        isActive     = true;
        lastMoveTime = Date.now();
      }
    };
    const onMouseLeave = () => {
      isActive = false;
      mouse3D.set(99999, 0, 99999);
    };
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
      edgeMats.forEach(m => m.resolution.set(w, h));
      updateCamera();
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    // ── Animation loop ─────────────────────────────────────────────
    let rafId: number;
    const lerpFn = (a: number, b: number, t: number) => a + (b - a) * t;

    // Nav-hover activation: when cursor is on navbar, simulate mouse at grid centre
    let navHovered = false;
    const onNavEnter = () => { navHovered = true; };
    const onNavLeave = () => { navHovered = false; };
    window.addEventListener("navHoverEnter", onNavEnter);
    window.addEventListener("navHoverLeave", onNavLeave);

    function animate() {
      if (!canvas) return;
      rafId = requestAnimationFrame(animate);

      // When navbar is hovered: pretend mouse is at grid centre, all cubes react
      if (navHovered) {
        mouse3D.set(0, 0, 0);
        isActive     = true;
        lastMoveTime = Date.now();
      }

      const now    = performance.now();
      const isIdle = !isActive || (Date.now() - lastMoveTime > idleMs);
      const mx     = mouse3D.x;
      const mz     = mouse3D.z;

      for (let i = 0; i < N; i++) {
        const cube = cubes[i];
        const { px, pz } = cube;

        const distToCenter = Math.sqrt(px * px + pz * pz);
        let fogFactor = 1.0 - (distToCenter - fogStart) / (fogEnd - fogStart);
        fogFactor = Math.max(0.0, Math.min(1.0, fogFactor));

        const distToMouse = Math.sqrt((px - mx) ** 2 + (pz - mz) ** 2);
        const active = !isIdle && distToMouse <= hoverR;

        let tH = minH;
        let tO = 0.0;

        if (active) {
          tH = maxH;
          tO = Math.min(1.0, fogFactor + 0.6);
          cube.nextUpdate = 0;
        } else if (isIdle) {
          if (now > cube.nextUpdate) {
            cube.idleTargetH = minH + Math.floor(Math.random() * idleHeightSteps) * idleHeightMult;
            cube.nextUpdate  = now + idleUpdateMin + Math.random() * idleUpdateRand;
          }
          tH = minH + (cube.idleTargetH - minH) * fogFactor;
          const maxIdleDiff = (idleHeightSteps - 1) * idleHeightMult;
          const progress = maxIdleDiff > 0 ? (cube.idleTargetH - minH) / maxIdleDiff : 0;
          tO = (0.10 + progress * 0.35) * fogFactor;
        }

        const lr     = tO > opacities[i] ? lerpIn : lerpOut;
        heights[i]   = lerpFn(heights[i],   tH, lr);
        opacities[i] = lerpFn(opacities[i], tO, lr);

        const h = heights[i];
        const o = opacities[i];

        groups[i].scale.y       = h;
        groups[i].position.y    = h * 0.5;
        solidMats[i].opacity    = o;
        edgeMats[i].opacity     = o;
        baseMeshMats[i].opacity = o;
      }

      composer.render();
    }

    updateCamera();
    animate();

    // ── Cleanup: hủy RAF, remove listeners, dispose GPU resources ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("navHoverEnter", onNavEnter);
      window.removeEventListener("navHoverLeave", onNavLeave);

      // Geometries
      bgGeom.dispose();
      edgesGeom.dispose();
      boxGeom.dispose();
      baseGeom.dispose();
      platformGeom.dispose();

      // Materials
      bgMat.dispose();
      platformMat.dispose();
      solidMats.forEach(m => m.dispose());
      edgeMats.forEach(m => m.dispose());
      baseMeshMats.forEach(m => m.dispose());

      // Render pipeline
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* Canvas Three.js — fixed toàn màn hình, làm nền phía sau */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none",
          display: "block",
        }}
      />
      {/* Vignette sương mù mép màn hình */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 62% 68% at 50% 46%, transparent 30%, rgba(0,0,0,0.50) 52%, rgba(0,0,0,0.78) 68%, rgba(0,0,0,0.92) 82%, rgba(0,0,0,0.97) 96%)",
        }}
      />
    </>
  );
}
