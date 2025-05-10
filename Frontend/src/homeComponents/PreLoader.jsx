import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text3D } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const AnimatedCertificate = ({ progress }) => {
  const groupRef = useRef(null);
  const sealRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current || !sealRef.current) return;

    // Smooth rotation for the certificate
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;

    // Pulsing effect for the seal
    const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
    sealRef.current.scale.set(pulseScale, pulseScale, pulseScale);

    // Update opacity based on progress
    const opacity = Math.max(0, Math.min(1, progress / 100));
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = opacity;
      }
    });
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Certificate base */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[4, 5.5, 0.05]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.3}
            transparent
            opacity={progress / 100}
          />
        </mesh>

        {/* Decorative lines */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0, 1.8 - i * 0.8, 0.03]} castShadow>
            <boxGeometry args={[3.2, 0.04, 0.01]} />
            <meshStandardMaterial
              color="#2563eb"
              transparent
              opacity={progress / 100}
            />
          </mesh>
        ))}

        {/* Seal */}
        <mesh ref={sealRef} position={[-1, -2, 0.03]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive="#3b82f6"
            emissiveIntensity={0.6}
            transparent
            opacity={progress / 100}
          />
        </mesh>

        {/* Signature placeholder */}
        <mesh position={[1.2, -2, 0.03]} castShadow>
          <boxGeometry args={[0.7, 0.7, 0.03]} />
          <meshStandardMaterial
            color="#0f172a"
            transparent
            opacity={progress / 100}
          />
        </mesh>

        {/* Title bar */}
        <mesh position={[0, 2.2, 0.03]} castShadow>
          <boxGeometry args={[3.5, 0.25, 0.02]} />
          <meshStandardMaterial
            color="#1d4ed8"
            emissive="#3b82f6"
            emissiveIntensity={0.4}
            transparent
            opacity={progress / 100}
          />
        </mesh>

        {/* 3D Text */}
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          position={[-1.5, 1, 0.05]}
          size={0.3}
          height={0.05}
          castShadow
        >
          CERTIFICATE
          <meshStandardMaterial
            color="#1e40af"
            transparent
            opacity={progress / 100}
          />
        </Text3D>
      </group>
    </Float>
  );
};

const Preloader = ({ progress }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #60a5fa 100%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: progress >= 100 ? "none" : "auto",
      }}
    >
      <div className="relative w-full h-[60vh] max-w-4xl">
        <Canvas
          shadows
          camera={{ position: [0, 0, 7], fov: 50 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.4} />
          <AnimatedCertificate progress={progress} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate
            autoRotateSpeed={0.4}
          />
        </Canvas>

        <motion.div
          className="absolute w-full text-center bottom-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Certificate Monitoring System
          </h2>
          <p className="text-blue-100 text-lg">
            Streamlining Issuance with Precision
          </p>
        </motion.div>
      </div>

      <div className="w-full max-w-lg px-6 mt-6">
        <motion.div
          className="h-3 bg-gray-800/50 rounded-full overflow-hidden shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        <motion.div
          className="mt-3 text-white text-center text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block px-4 py-2 bg-blue-900/30 backdrop-blur-md rounded-full shadow-md">
            Loading... {Math.round(progress)}%
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;