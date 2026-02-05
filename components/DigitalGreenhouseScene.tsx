"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  Sparkles,
  Stars,
  Float,
  MeshDistortMaterial,
  Trail,
  Environment,
  Cloud,
} from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const HEARTBEAT = [0.0, 0.35, 0.7, 1.0];

type FlowerData = {
  id: number;
  position: [number, number, number];
  hue: number;
  type?: "rose" | "tulip" | "daisy";
  scale?: number;
};

type SceneProps = {
  onFlowerSelect: (data: FlowerData) => void;
  selectedFlower?: FlowerData | null;
};

// Beautiful glowing moon
const Moon = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group position={[25, 20, -40]}>
      <mesh ref={ref}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fef3c7"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Moon glow */}
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#fef3c7" transparent opacity={0.15} />
      </mesh>
      <pointLight intensity={2} distance={100} color="#fef3c7" />
    </group>
  );
};

// Glowing Heart that floats around - very slow and subtle
const FloatingHeart3D = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={position} scale={0.25}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#f472b6"
          emissive="#e11d48"
          emissiveIntensity={1.5}
          distort={0.3}
          speed={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      <pointLight position={position} intensity={0.2} distance={4} color="#f472b6" />
    </Float>
  );
};

// Magical Firefly particles with glow
const Firefly = ({ index }: { index: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const startPos = useMemo(() => [
    (Math.random() - 0.5) * 40,
    Math.random() * 3 + 0.5,
    (Math.random() - 0.5) * 40,
  ], []);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + index * 100;
      ref.current.position.x = startPos[0] + Math.sin(t * 0.3) * 4;
      ref.current.position.y = startPos[1] + Math.sin(t * 0.5) * 2;
      ref.current.position.z = startPos[2] + Math.cos(t * 0.2) * 4;
      const scale = 0.06 + Math.sin(t * 4) * 0.03;
      ref.current.scale.setScalar(scale);
    }
  });

  const color = index % 3 === 0 ? "#fbbf24" : index % 3 === 1 ? "#f472b6" : "#a78bfa";

  return (
    <Trail width={0.3} length={8} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref} position={startPos as [number, number, number]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
};

// Beautiful Rose Flower - Improved design
const RoseFlower = ({
  data,
  onSelect,
}: {
  data: FlowerData;
  onSelect: (data: FlowerData) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulse = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const baseScale = data.scale || 1;

  useFrame((state, delta) => {
    pulse.current += delta * 0.6;
    const t = (Math.sin(pulse.current * Math.PI * 2) + 1) * 0.5;
    const heartbeat = THREE.MathUtils.lerp(HEARTBEAT[1], HEARTBEAT[3], t);
    const hoverScale = hovered ? 1.3 : 1;
    const scale = baseScale * hoverScale * (0.9 + heartbeat * 0.1);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const petalColor = new THREE.Color(`hsl(${data.hue}, 85%, 50%)`);
  const petalEmissive = new THREE.Color(`hsl(${data.hue}, 90%, 45%)`);

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
      <group
        ref={groupRef}
        position={data.position}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(data);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Stem */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 1.8, 8]} />
          <meshStandardMaterial 
            color="#166534" 
            emissive="#14532d" 
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Leaves */}
        {[-0.2, 0.3, 0.7].map((y, i) => (
          <mesh 
            key={i} 
            position={[0.15 * (i % 2 === 0 ? 1 : -1), y, 0]} 
            rotation={[0.2, i * Math.PI * 0.7, Math.PI / 5 * (i % 2 === 0 ? 1 : -1)]}
          >
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial 
              color="#22c55e" 
              emissive="#16a34a" 
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}

        {/* Rose petals - beautiful layered spiral */}
        <group position={[0, 1.4, 0]}>
          {Array.from({ length: 16 }).map((_, i) => {
            const layer = Math.floor(i / 5);
            const indexInLayer = i % 5;
            const angle = (indexInLayer * Math.PI * 2) / 5 + layer * 0.5;
            const radius = 0.12 + layer * 0.15;
            const height = layer * 0.1;
            const tilt = 0.4 - layer * 0.15;
            
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  height,
                  Math.sin(angle) * radius,
                ]}
                rotation={[tilt, angle + Math.PI / 2, 0]}
              >
                <sphereGeometry args={[0.2 - layer * 0.03, 12, 12]} />
                <meshStandardMaterial
                  color={petalColor}
                  emissive={petalEmissive}
                  emissiveIntensity={hovered ? 1.5 : 0.7}
                  metalness={0.15}
                  roughness={0.25}
                />
              </mesh>
            );
          })}
          
          {/* Glowing center */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
        
        {/* Glow effect when hovered */}
        {hovered && (
          <pointLight position={[0, 1, 0]} intensity={2} color="#e11d48" distance={4} />
        )}
      </group>
    </Float>
  );
};

// Magical Tulip - Enhanced
const TulipFlower = ({
  data,
  onSelect,
}: {
  data: FlowerData;
  onSelect: (data: FlowerData) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseScale = data.scale || 1;
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
      const sway = Math.sin(state.clock.elapsedTime * 1.5 + data.id) * 0.08;
      groupRef.current.rotation.z = sway;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.03} floatIntensity={0.15}>
      <group
        ref={groupRef}
        position={data.position}
        scale={baseScale * (hovered ? 1.2 : 1)}
        onClick={(e) => { e.stopPropagation(); onSelect(data); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.06, 1.8, 6]} />
          <meshStandardMaterial 
            color="#15803d" 
            emissive="#14532d" 
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Tulip petals - cup shaped */}
        <group position={[0, 1.5, 0]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={i}
              rotation={[0.35, (Math.PI * 2 * i) / 6, 0]}
              position={[
                Math.cos((Math.PI * 2 * i) / 6) * 0.08,
                0,
                Math.sin((Math.PI * 2 * i) / 6) * 0.08,
              ]}
            >
              <capsuleGeometry args={[0.14, 0.4, 6, 10]} />
              <meshStandardMaterial
                color={new THREE.Color(`hsl(${data.hue + i * 3}, 75%, 55%)`)}
                emissive={new THREE.Color(`hsl(${data.hue}, 80%, 50%)`)}
                emissiveIntensity={hovered ? 1.8 : 0.6}
                metalness={0.1}
                roughness={0.3}
              />
            </mesh>
          ))}
          
          {/* Center glow */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
        
        {hovered && <pointLight position={[0, 1.2, 0]} intensity={1.5} color="#f472b6" distance={3} />}
      </group>
    </Float>
  );
};

// Glowing Daisy - Enhanced
const DaisyFlower = ({
  data,
  onSelect,
}: {
  data: FlowerData;
  onSelect: (data: FlowerData) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseScale = data.scale || 1;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.06} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={data.position}
        scale={baseScale * (hovered ? 1.25 : 1)}
        onClick={(e) => { e.stopPropagation(); onSelect(data); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.025, 0.05, 1.4, 6]} />
          <meshStandardMaterial 
            color="#22c55e" 
            emissive="#16a34a"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        <group position={[0, 1.1, 0]} rotation={[-0.3, 0, 0]}>
          {/* Petals - pointing outward */}
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((Math.PI * 2 * i) / 12) * 0.22,
                0,
                Math.sin((Math.PI * 2 * i) / 12) * 0.22,
              ]}
              rotation={[Math.PI / 2.5, 0, (Math.PI * 2 * i) / 12 + Math.PI / 2]}
            >
              <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
              <meshStandardMaterial
                color="white"
                emissive="#fef3c7"
                emissiveIntensity={hovered ? 1.2 : 0.4}
                metalness={0.05}
                roughness={0.4}
              />
            </mesh>
          ))}
          
          {/* Golden center */}
          <mesh>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
        
        {hovered && <pointLight position={[0, 1, 0]} intensity={1.5} color="#fbbf24" distance={2.5} />}
      </group>
    </Float>
  );
};

// Camera controller - smoothly zooms in when flower selected, zooms out when closed
const CameraRig = ({ target }: { target?: THREE.Vector3 | null }) => {
  const { camera } = useThree();
  const defaultPos = useRef(new THREE.Vector3(0, 3, 10));
  const defaultLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (target) {
      // Zoom in to flower
      const desired = new THREE.Vector3(target.x, target.y + 1.5, target.z + 3);
      camera.position.lerp(desired, 0.03);
      currentLookAt.current.lerp(target, 0.03);
      camera.lookAt(currentLookAt.current);
    } else {
      // Smoothly zoom back out to default position
      camera.position.lerp(defaultPos.current, 0.02);
      currentLookAt.current.lerp(defaultLookAt.current, 0.02);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
};

// Beautiful ground with gradient
const MagicalGround = () => {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[60, 80]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#1e1b4b"
          emissiveIntensity={0.2}
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      
      {/* Glowing rings on ground */}
      {[8, 16, 24, 35].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
          <ringGeometry args={[radius - 0.15, radius, 64]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? "#e11d48" : "#fbbf24"} 
            transparent 
            opacity={0.15 - i * 0.03} 
          />
        </mesh>
      ))}
    </group>
  );
};

// Atmospheric clouds
const AtmosphericClouds = () => {
  return (
    <group position={[0, 15, -30]}>
      <Cloud
        opacity={0.3}
        speed={0.2}
        bounds={[30, 5, 5]}
        segments={30}
        color="#1e1b4b"
      />
      <Cloud
        position={[-20, 5, -10]}
        opacity={0.2}
        speed={0.15}
        bounds={[20, 3, 3]}
        segments={20}
        color="#312e81"
      />
      <Cloud
        position={[25, 8, -15]}
        opacity={0.25}
        speed={0.18}
        bounds={[25, 4, 4]}
        segments={25}
        color="#1e1b4b"
      />
    </group>
  );
};

const Garden = ({ onSelect }: { onSelect: (data: FlowerData) => void }) => {
  const flowers = useMemo<FlowerData[]>(() => {
    const data: FlowerData[] = [];
    const types: Array<"rose" | "tulip" | "daisy"> = ["rose", "tulip", "daisy"];
    
    // Create a beautiful circular arrangement
    // Inner circle - close to viewer
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const radius = 3;
      data.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius - 2,
        ],
        hue: 330 + Math.random() * 30,
        type: types[i % 3],
        scale: 1.1,
      });
    }
    
    // Middle circle
    for (let i = 8; i < 20; i++) {
      const angle = ((i - 8) * Math.PI * 2) / 12 + 0.2;
      const radius = 6;
      data.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius - 1,
        ],
        hue: 320 + Math.random() * 40,
        type: types[i % 3],
        scale: 0.9,
      });
    }
    
    // Outer scattered flowers
    for (let i = 20; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 15;
      data.push({
        id: i,
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ],
        hue: 310 + Math.random() * 50,
        type: types[Math.floor(Math.random() * 3)],
        scale: 0.6 + Math.random() * 0.5,
      });
    }
    
    return data;
  }, []);

  return (
    <group>
      {flowers.map((flower) => {
        switch (flower.type) {
          case "tulip":
            return <TulipFlower key={flower.id} data={flower} onSelect={onSelect} />;
          case "daisy":
            return <DaisyFlower key={flower.id} data={flower} onSelect={onSelect} />;
          default:
            return <RoseFlower key={flower.id} data={flower} onSelect={onSelect} />;
        }
      })}
    </group>
  );
};

export const DigitalGreenhouseScene = ({
  onFlowerSelect,
  selectedFlower,
}: SceneProps) => {
  const target = selectedFlower
    ? new THREE.Vector3(
        selectedFlower.position[0],
        selectedFlower.position[1],
        selectedFlower.position[2]
      )
    : null;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 10], fov: 55 }}
      className="h-full w-full"
    >
      {/* Beautiful night sky gradient */}
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 15, 50]} />
      
      {/* Rich atmospheric lighting */}
      <ambientLight intensity={0.15} />
      <Moon />
      
      {/* Key lights */}
      <directionalLight position={[10, 20, 10]} intensity={0.4} color="#fef3c7" castShadow />
      <pointLight position={[-15, 8, -10]} intensity={0.8} color="#e11d48" distance={40} />
      <pointLight position={[15, 6, 10]} intensity={0.6} color="#8b5cf6" distance={35} />
      <pointLight position={[0, 3, 5]} intensity={0.4} color="#f472b6" distance={20} />
      
      {/* Rim lights for flowers */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        color="#fbbf24"
        castShadow
      />
      
      <Suspense fallback={null}>
        <MagicalGround />
        <AtmosphericClouds />
        <Garden onSelect={onFlowerSelect} />
        
        {/* Floating hearts */}
        {Array.from({ length: 10 }).map((_, i) => (
          <FloatingHeart3D
            key={i}
            position={[
              (Math.random() - 0.5) * 30,
              2 + Math.random() * 5,
              (Math.random() - 0.5) * 30,
            ]}
          />
        ))}
        
        {/* Fireflies */}
        {Array.from({ length: 30 }).map((_, i) => (
          <Firefly key={i} index={i} />
        ))}
        
        {/* Multi-layer sparkles */}
        <Sparkles count={300} speed={0.2} size={5} color="#e11d48" scale={50} opacity={0.8} />
        <Sparkles count={200} speed={0.3} size={4} color="#fbbf24" scale={45} opacity={0.7} />
        <Sparkles count={150} speed={0.25} size={3} color="#f472b6" scale={40} opacity={0.6} />
        <Sparkles count={100} speed={0.35} size={2} color="#a78bfa" scale={35} opacity={0.5} />
        
        {/* Dense starry sky */}
        <Stars radius={120} depth={60} count={8000} factor={6} fade speed={0.3} />
        
        <Preload all />
      </Suspense>
      
      <CameraRig target={target} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 8}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.4}
        panSpeed={0.4}
        zoomSpeed={0.6}
        touches={{
          ONE: 1, // ROTATE
          TWO: 2, // DOLLY_PAN
        }}
        makeDefault
      />
    </Canvas>
  );
};
