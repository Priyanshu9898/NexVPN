'use client'

// NOTE: Import this component with dynamic() + ssr:false in Next.js pages:
//   const Shield3D = dynamic(() => import('@/components/3d/Shield3D'), { ssr: false })

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

// ── Outer Rings ────────────────────────────────────────────────────────────────

function OuterRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.003
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.002
  })

  return (
    <>
      {/* Primary ring */}
      <Torus ref={ring1Ref} args={[1.4, 0.02, 16, 100]}>
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.8}
        />
      </Torus>

      {/* Secondary ring (tilted) */}
      <Torus
        ref={ring2Ref}
        args={[1.4, 0.02, 16, 100]}
        rotation={[Math.PI / 3, 0, 0]}
      >
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </Torus>
    </>
  )
}

// ── Lock Body ──────────────────────────────────────────────────────────────────

function LockIcon() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(clock.elapsedTime * 0.8) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lock body */}
      <Box args={[0.6, 0.5, 0.1]} position={[0, -0.05, 0]}>
        <meshStandardMaterial
          color="#0A1828"
          emissive="#00D4FF"
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.7}
        />
      </Box>

      {/* Lock shackle (top arch) */}
      <Torus
        args={[0.2, 0.04, 16, 50, Math.PI]}
        position={[0, 0.35, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.4}
        />
      </Torus>

      {/* Keyhole dot */}
      <Sphere args={[0.05, 16, 16]} position={[0, -0.04, 0.06]}>
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={1.0}
        />
      </Sphere>
    </group>
  )
}

// ── Orbiting Dots ──────────────────────────────────────────────────────────────

function OrbitingDots() {
  const dot1Ref = useRef<THREE.Mesh>(null)
  const dot2Ref = useRef<THREE.Mesh>(null)
  const dot3Ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (dot1Ref.current) {
      dot1Ref.current.position.x = Math.cos(t * 0.5) * 1.0
      dot1Ref.current.position.y = Math.sin(t * 0.5) * 1.0
    }

    if (dot2Ref.current) {
      dot2Ref.current.position.x = Math.cos(t * 0.3 + 2) * 0.8
      dot2Ref.current.position.z = Math.sin(t * 0.3 + 2) * 0.8
    }

    if (dot3Ref.current) {
      dot3Ref.current.position.x = Math.cos(t * 0.7 + 4) * 1.2
      dot3Ref.current.position.y = Math.sin(t * 0.7 + 4) * 0.6
    }
  })

  const dotMaterial = (
    <meshStandardMaterial
      color="#00D4FF"
      emissive="#00D4FF"
      emissiveIntensity={1.0}
    />
  )

  return (
    <>
      <Sphere ref={dot1Ref} args={[0.03, 16, 16]}>
        {dotMaterial}
      </Sphere>
      <Sphere ref={dot2Ref} args={[0.03, 16, 16]}>
        {dotMaterial}
      </Sphere>
      <Sphere ref={dot3Ref} args={[0.03, 16, 16]}>
        {dotMaterial}
      </Sphere>
    </>
  )
}

// ── Main Scene ─────────────────────────────────────────────────────────────────

function ShieldScene() {
  return (
    <group>
      <OuterRings />
      <LockIcon />
      <OrbitingDots />
    </group>
  )
}

// ── Canvas Export ──────────────────────────────────────────────────────────────

export default function Shield3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.05} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#00D4FF" />
      <pointLight position={[-3, -3, -3]} intensity={0.5} color="#0044AA" />
      <Suspense fallback={null}>
        <ShieldScene />
      </Suspense>
    </Canvas>
  )
}
