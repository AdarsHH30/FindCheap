"use client";

import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import PriceComparisonCard from "@/components/PriceComparisonCard";

function Model() {
  const gltf = useGLTF("models/earbuds.glb");
  const meshRef = useRef<THREE.Group>(null);

  // Add smooth rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive
        object={gltf.scene}
        scale={0.15}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      />
    </group>
  );
}

const ModelViewer = () => {
  // Responsive height and camera state
  const [height, setHeight] = useState("400px");
  const [cameraConfig, setCameraConfig] = useState({
    position: [0, 0, 5] as [number, number, number],
    fov: 35,
  });

  // Update height and camera based on viewport width
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setHeight("280px");
        setCameraConfig({ position: [0, 0, 6], fov: 35 });
      } else if (width < 768) {
        setHeight("320px");
        setCameraConfig({ position: [0, 0, 5.5], fov: 60 });
      } else if (width < 1024) {
        setHeight("380px");
        setCameraConfig({ position: [0, 0, 5], fov: 55 });
      } else {
        setHeight("500px");
        setCameraConfig({ position: [0, 0, 4.5], fov: 42 });
      }
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <div
      className="w-full max-w-7xl mx-auto rounded-lg overflow-hidden"
      style={{ height, width: "99vw" }}
    >
      {/* 3D Model Canvas */}
      <Canvas
        shadows
        camera={{
          position: cameraConfig.position,
          fov: cameraConfig.fov,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[2, 2]}
      >
        {/* Environment and lighting */}
        <Environment preset="studio" />

        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.8} />
        <pointLight position={[0, 0, 5]} intensity={0.5} />

        {/* Contact shadows for better ground connection */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Interactive camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />

        <Model />
      </Canvas>
      {/* Price comparison overlay */}
    </div>
  );
};

export default ModelViewer;
