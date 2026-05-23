'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 4000

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread wider than viewport to ensure full coverage
      arr[i * 3]     = (Math.random() - 0.5) * viewport.width  * 2.5
      arr[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    return arr
  }, [viewport.width, viewport.height])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.025
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.015) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00D4FF"
        size={0.055}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

export function FloatingParticles() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <ParticleField />
    </Canvas>
  )
}

export default FloatingParticles
