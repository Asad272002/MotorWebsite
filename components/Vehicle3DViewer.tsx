'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stage } from '@react-three/drei';

const ModelPlaceholder = () => {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="#D4C5B0" roughness={0.2} metalness={0.8} />
    </mesh>
  );
};

export const Vehicle3DViewer = () => {
  return (
    <div className="w-full h-[50vh] bg-secondary/10 cursor-move relative">
       <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest text-muted">
         Interactive 3D
       </div>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <ModelPlaceholder />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
};
