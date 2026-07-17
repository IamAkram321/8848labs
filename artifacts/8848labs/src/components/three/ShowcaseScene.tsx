import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Wireframe } from '@react-three/drei';
import * as THREE from 'three';

function ObjectEvolution() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* The core solid object */}
        <mesh>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial 
            color="#222" // Dark graphite
            roughness={0.1}
            metalness={0.9}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* The wireframe shell representing the digital model */}
        <mesh scale={1.1}>
          <icosahedronGeometry args={[2, 1]} />
          <meshBasicMaterial color="#B8956A" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export function ShowcaseScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} className="w-full h-full bg-foreground">
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#B8956A" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
      
      <ObjectEvolution />
      
      <Environment preset="city" />
      
      {/* Add subtle fog matching the dark background */}
      <fog attach="fog" args={['#1A1714', 5, 15]} />
    </Canvas>
  );
}

export default ShowcaseScene;
