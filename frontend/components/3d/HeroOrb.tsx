'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Particle sphere ──────────────────────────────────────────────────────────
function ParticleSphere() {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 1800
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const violet = new THREE.Color('#7C5CFF')
    const violet2 = new THREE.Color('#A688FF')
    const emerald = new THREE.Color('#00E5A0')

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.6 + (Math.random() - 0.5) * 0.12
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi)
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const t = Math.random()
      const base = t < 0.05 ? emerald : t < 0.5 ? violet2 : violet
      col[i * 3]     = base.r
      col[i * 3 + 1] = base.g
      col[i * 3 + 2] = base.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.08
    ref.current.rotation.x += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  )
}

// ── Inner glow sphere ────────────────────────────────────────────────────────
function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ;(ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.4 + Math.sin(t * 1.5) * 0.15
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.9, 48, 48]} />
      <meshStandardMaterial
        color="#0C0C18"
        emissive="#7C5CFF"
        emissiveIntensity={0.4}
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  )
}

// ── Wireframe ring ───────────────────────────────────────────────────────────
function Ring({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
  })
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 4, 120]} />
      <meshBasicMaterial color="#7C5CFF" transparent opacity={0.35} />
    </mesh>
  )
}

// ── Orbiting node ────────────────────────────────────────────────────────────
function OrbitNode({ orbitR, speed, offset, color }: { orbitR: number; speed: number; offset: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.cos(t) * orbitR
    ref.current.position.z = Math.sin(t) * orbitR
    ref.current.position.y = Math.sin(t * 0.5) * 0.2
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        roughness={0}
        metalness={0}
      />
    </mesh>
  )
}

// ── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#7C5CFF" />
      <pointLight position={[-3, -2, 2]} intensity={1} color="#A688FF" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#00E5A0" />

      <ParticleSphere />
      <CoreSphere />
      <Ring radius={1.15} speed={0.4}  tilt={Math.PI / 6} />
      <Ring radius={1.35} speed={-0.25} tilt={Math.PI / 3} />
      <Ring radius={1.55} speed={0.15}  tilt={Math.PI / 2} />

      <OrbitNode orbitR={1.15} speed={0.6}  offset={0}           color="#7C5CFF" />
      <OrbitNode orbitR={1.35} speed={-0.4} offset={Math.PI * 0.6} color="#A688FF" />
      <OrbitNode orbitR={1.55} speed={0.3}  offset={Math.PI * 1.2} color="#00E5A0" />
      <OrbitNode orbitR={1.25} speed={0.5}  offset={Math.PI * 1.8} color="#7C5CFF" />
    </>
  )
}

// ── Export ───────────────────────────────────────────────────────────────────
export default function HeroOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  )
}
