import React, { useRef } from "react";
import { useFBX } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Avatar3D({ modelUrl }) {
  const group = useRef();
  const character = useFBX(modelUrl);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={character} scale={0.011} />
    </group>
  );
}