'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const AccentParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(1337);
    const points = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i++) {
      const r = 3 + rand() * 3.5;
      const a = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * 2.2;
      points[i * 3] = Math.cos(a) * r;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(points, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.06;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} scale={1.05}>
        <torusKnotGeometry args={[0.9, 0.24, 180, 32]} />
        <meshPhysicalMaterial
          color="#D89043"
          emissive="#914932"
          emissiveIntensity={0.10}
          metalness={0.7}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.18}
          transparent
          opacity={0.35}
        />
      </mesh>
      <points geometry={geometry}>
        <pointsMaterial
          color="#D7D7D7"
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export const Atmosphere3D = ({ className }: { className?: string }) => {
  return (
    <div className={className ?? 'absolute inset-0 pointer-events-none'}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 3, 6]} intensity={0.85} color="#F3D777" />
        <Stars radius={60} depth={35} count={1400} factor={2.6} saturation={0} fade speed={0.8} />
        <AccentParticles />
      </Canvas>
    </div>
  );
};
