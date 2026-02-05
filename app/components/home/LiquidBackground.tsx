"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useEffect, Suspense } from "react";

// --- Shader Definition ---
// This shader creates a "liquid glass" distortion effect around the mouse cursor.
const LiquidDistortionMaterial = shaderMaterial(
    {
        uTexture: new THREE.Texture(),
        uMouse: new THREE.Vector2(0.5, 0.5),
        uResolution: new THREE.Vector2(1, 1),
        uHover: 0, // 0 to 1, intensity of the effect
        uTime: 0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uHover;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Calculate aspect ratio to make the interaction circle circular, not oval
      float aspect = uResolution.x / uResolution.y;
      vec2 aspectCorrectedUV = uv;
      aspectCorrectedUV.x *= aspect;
      
      vec2 aspectCorrectedMouse = uMouse;
      aspectCorrectedMouse.x *= aspect;

      // Distance from mouse
      float dist = distance(aspectCorrectedUV, aspectCorrectedMouse);
      
      // Distortion parameters
      float radius = 0.40; // Slightly larger liquid blob
      float intensity = 0.2 * uHover; // Strength of distortion
      
      // Smooth smoothstep for liquid falloff
      float wave = smoothstep(radius, 0.0, dist);
      
      // Calculate distortion vector
      vec2 distortion = (vUv - uMouse) * wave * intensity;

      gl_FragColor = texture2D(uTexture, uv - distortion);
    }
  `
);

extend({ LiquidDistortionMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        liquidDistortionMaterial: any;
    }
}

function Scene() {
    const { viewport, size, gl } = useThree();
    const texture = useTexture("/images/w214.jpg");

    const materialRef = useRef<any>(null);

    // Mouse position state
    const currentMouse = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
    const targetMouse = useMemo(() => new THREE.Vector2(0.5, 0.5), []);

    // Robust mouse tracking using window listener
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // If gl is not available, we can't calculate relative position
            if (!gl.domElement) return;
            const rect = gl.domElement.getBoundingClientRect();

            // Calculate mouse position relative to the canvas
            let x = (e.clientX - rect.left) / rect.width;
            let y = 1.0 - ((e.clientY - rect.top) / rect.height); // Flip Y for GLSL

            targetMouse.set(x, y);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [gl, targetMouse]);

    useFrame((state) => {
        if (materialRef.current) {
            // Lerp for smooth liquid feel
            currentMouse.lerp(targetMouse, 0.08);

            materialRef.current.uMouse = currentMouse;
            materialRef.current.uResolution = new THREE.Vector2(size.width, size.height);
            materialRef.current.uHover = 1.0;
            materialRef.current.uTime = state.clock.elapsedTime;
        }
    });

    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <liquidDistortionMaterial
                ref={materialRef}
                uTexture={texture}
                toneMapped={false}
            />
        </mesh>
    );
}

export default function LiquidBackground() {
    return (
        <div className="hidden md:block absolute inset-0 z-0 w-full h-full pointer-events-none">
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ antialias: false, alpha: true }}
                resize={{ scroll: false, debounce: 0 }}
                style={{ pointerEvents: 'none' }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
