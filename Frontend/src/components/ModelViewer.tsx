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
import { cn } from "@/lib/utils";
import PriceComparisonCard from "@/components/PriceComparisonCard";

const MODEL_PATH = "/models/earbuds.glb";

function Model() {
  const gltf = useGLTF(MODEL_PATH);
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

  // Center the model by adjusting its pivot point
  useEffect(() => {
    if (gltf.scene) {
      // Calculate the bounding box to find the center
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());

      // Center the model by offsetting it
      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;
    }
  }, [gltf.scene]);

  return (
    <group ref={meshRef}>
      <primitive
        object={gltf.scene}
        scale={0.12}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      />
    </group>
  );
}

interface PriceComparisonData {
  productName: string;
  prices: {
    platform: string;
    price: string;
    isLowest?: boolean;
  }[];
}

interface ModelViewerProps {
  className?: string;
  priceComparison?: PriceComparisonData;
}

const ModelViewer = ({ className = "", priceComparison }: ModelViewerProps) => {
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
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background/80 shadow-xl",
        className
      )}
      style={{ height }}
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
        dpr={[1, 2]}
      >
        {/* Environment and lighting */}
        <Environment preset="studio" />

        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[0, 0, 0]}
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
      {priceComparison ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex w-full justify-center px-4">
          <PriceComparisonCard
            productName={priceComparison.productName}
            prices={priceComparison.prices}
            className="pointer-events-auto relative w-full max-w-xs border-border/70 bg-card/90 shadow-lg"
          />
        </div>
      ) : null}
    </div>
  );
};

export default ModelViewer;

useGLTF.preload(MODEL_PATH);
