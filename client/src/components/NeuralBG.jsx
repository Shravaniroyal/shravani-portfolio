import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 90;
const CONNECT_DIST = 2.4;

function Network() {
  const group = useRef();
  const smoothed = useRef({ x: 0, y: 0 });

  const { positions, linePositions } = useMemo(() => {
    const pts = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 7
        )
      );
    }
    const positions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => p.toArray(positions, i * 3));

    const lines = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < CONNECT_DIST) {
          lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    return { positions, linePositions: new Float32Array(lines) };
  }, []);

  useFrame((state, delta) => {
    const { mouse } = state;
    smoothed.current.x += (mouse.x - smoothed.current.x) * 0.03;
    smoothed.current.y += (mouse.y - smoothed.current.y) * 0.03;
    if (group.current) {
      group.current.rotation.y += delta * 0.045;
      group.current.rotation.x = smoothed.current.y * 0.12;
      group.current.rotation.y += smoothed.current.x * 0.0006;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#9db8ff" size={0.065} sizeAttenuation transparent opacity={0.9} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#4a5fb8" transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

export default function NeuralBG() {
  return (
    <div className="neural-bg">
      <Canvas camera={{ position: [0, 0, 9], fov: 55 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <Network />
      </Canvas>
    </div>
  );
}