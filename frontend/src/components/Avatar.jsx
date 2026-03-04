import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const HologramCore = ({ isSpeaking, isListening }) => {
    const meshRef = useRef();
    const ringRef1 = useRef();
    const ringRef2 = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Core rotation
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.5;
            meshRef.current.rotation.z = t * 0.2;

            // Dynamic scaling based on state
            const scale = isSpeaking ? 1 + Math.sin(t * 15) * 0.1 : 1;
            meshRef.current.scale.setScalar(scale);
        }

        // Rings rotation
        if (ringRef1.current) {
            ringRef1.current.rotation.x = t * 0.8;
            ringRef1.current.rotation.y = t * 0.4;
        }
        if (ringRef2.current) {
            ringRef2.current.rotation.y = -t * 0.6;
            ringRef2.current.rotation.z = t * 0.3;
        }
    });

    return (
        <group>
            {/* Central Holographic Core */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color="#00f0ff"
                    speed={isListening ? 5 : 2}
                    distort={0.4}
                    radius={1}
                    emissive="#00f0ff"
                    emissiveIntensity={isSpeaking ? 2 : 1}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Orbiting HUD Rings */}
            <mesh ref={ringRef1}>
                <torusGeometry args={[1.5, 0.02, 16, 100]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} transparent opacity={0.4} />
            </mesh>

            <mesh ref={ringRef2}>
                <torusGeometry args={[1.8, 0.01, 16, 100]} />
                <meshStandardMaterial color="#0099ff" emissive="#0099ff" emissiveIntensity={1} transparent opacity={0.3} />
            </mesh>

            {/* Point light for internal glow */}
            <pointLight position={[0, 0, 0]} color="#00f0ff" intensity={2} distance={5} />
        </group>
    );
};

export default function Avatar({ isSpeaking = false, isListening = false }) {
    return (
        <div className="w-full h-[400px] md:h-[600px] cursor-pointer relative overflow-hidden">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <HologramCore isSpeaking={isSpeaking} isListening={isListening} />
                </Float>
            </Canvas>

            {/* UI Overlay shadows/effects */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60" />
        </div>
    );
}
