"use client";

// TODO: Add moment or animation to the model

import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Model() {
  const gltf = useGLTF("models/earbuds.glb");
  return <primitive object={gltf.scene} scale={0.15} castShadow />;
}

const ModelViewer = () => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-y-hidden overflow-x-clip">
      {/* 3D Model Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Background Wall */}
        <mesh position={[0, 0, -2]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#008c75" />{" "}
          {/* Adjust color to match your primary theme */}
        </mesh>

        {/* Lighting */}
        <ambientLight intensity={1} />
        <directionalLight
          position={[2, 2, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[2, 2, -2]} intensity={5} />

        <Model />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
