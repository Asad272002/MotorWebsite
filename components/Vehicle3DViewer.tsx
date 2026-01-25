'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stage, useGLTF } from '@react-three/drei';

interface ModelProps {
  path: string;
}

const Model = ({ path }: ModelProps) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};

const ModelPlaceholder = () => {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="#D4C5B0" roughness={0.2} metalness={0.8} />
    </mesh>
  );
};

interface Vehicle3DViewerProps {
  modelPath?: string;
  imagePath?: string;
}

export const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({ modelPath, imagePath }) => {
  if (!modelPath && imagePath) {
    return (
      <div className="w-full h-[50vh] bg-secondary/10 relative overflow-hidden flex items-center justify-center">
         <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest text-muted">
           High Definition View
         </div>
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img 
            src={imagePath} 
            alt="Vehicle View" 
            className="max-w-full max-h-full object-contain p-8 hover:scale-105 transition-transform duration-700 ease-out"
         />
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh] bg-secondary/10 cursor-move relative">
       <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 text-xs uppercase tracking-widest text-muted">
         Interactive 3D
       </div>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {modelPath ? <Model path={modelPath} /> : <ModelPlaceholder />}
          </Stage>
        </Suspense>
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
};
