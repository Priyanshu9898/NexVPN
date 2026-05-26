'use client'

// Import with dynamic() + ssr:false:
//   const Globe = dynamic(() => import('@/components/3d/Globe'), { ssr: false })

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Helpers ──────────────────────────────────────────────────────────────────

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SERVER_LOCATIONS = [
  { lat: 51.5,  lng: -0.1,   city: 'London' },
  { lat: 52.5,  lng: 13.4,   city: 'Frankfurt' },
  { lat: 48.9,  lng: 2.3,    city: 'Paris' },
  { lat: 40.7,  lng: -74.0,  city: 'New York' },
  { lat: 37.8,  lng: -122.4, city: 'San Francisco' },
  { lat: 35.7,  lng: 139.7,  city: 'Tokyo' },
  { lat: 1.3,   lng: 103.8,  city: 'Singapore' },
  { lat: -33.9, lng: 151.2,  city: 'Sydney' },
  { lat: 19.1,  lng: 72.9,   city: 'Mumbai' },
  { lat: 25.2,  lng: 55.3,   city: 'Dubai' },
  { lat: -23.5, lng: -46.6,  city: 'São Paulo' },
  { lat: 55.8,  lng: 37.6,   city: 'Moscow' },
]

const ARC_PAIRS: [number, number, number][] = [
  [1, 3, 0.65],   // Frankfurt → New York
  [0, 6, 0.70],   // London → Singapore
  [4, 5, 0.75],   // San Francisco → Tokyo
  [9, 10, 0.60],  // Dubai → São Paulo
  [11, 7, 0.70],  // Moscow → Sydney
  [2, 8, 0.55],   // Paris → Mumbai
]

// ── Sub-components ────────────────────────────────────────────────────────────

function EarthSphere() {
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.08 + Math.sin(clock.elapsedTime * 0.6) * 0.04
    }
  })

  return (
    <group>
      {/* Layer 1: Core sphere with subtle emissive pulse */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color="#060D18"
          emissive="#1a0a3a"
          emissiveIntensity={0.08}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Layer 2: Wireframe grid overlay — visible but delicate */}
      <mesh>
        <sphereGeometry args={[1.82, 36, 36]} />
        <meshBasicMaterial color="#7C5CFF" wireframe transparent opacity={0.14} />
      </mesh>

      {/* Layer 3: Inner atmosphere (FrontSide rim effect) */}
      <mesh>
        <sphereGeometry args={[1.90, 32, 32]} />
        <meshBasicMaterial color="#7C5CFF" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Layer 4: Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshBasicMaterial color="#5a3de8" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Layer 5: Wide halo */}
      <mesh>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshBasicMaterial color="#4428cc" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function ServerDots() {
  const groupRef = useRef<THREE.Group>(null)

  const dots = useMemo(
    () =>
      SERVER_LOCATIONS.map(({ lat, lng }, i) => ({
        pos: latLngToVec3(lat, lng, 1.83),
        active: i === 1, // Frankfurt is the "selected" node
      })),
    [],
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // Subtle oscillation on all dots
    const t = clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const mesh = (child as THREE.Group).children[0] as THREE.Mesh
      if (mesh?.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 0.7 + Math.sin(t * 1.2 + i * 0.8) * 0.3
      }
    })
  })

  return (
    <group ref={groupRef}>
      {dots.map(({ pos, active }, i) => (
        <group key={i} position={pos}>
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[active ? 0.038 : 0.028, 16, 16]} />
            <meshStandardMaterial
              color={active ? '#00E5A0' : '#7C5CFF'}
              emissive={active ? '#00E5A0' : '#7C5CFF'}
              emissiveIntensity={active ? 1.2 : 0.8}
              roughness={0}
              metalness={0}
            />
          </mesh>
          {/* Inner glow ring */}
          <mesh>
            <sphereGeometry args={[active ? 0.065 : 0.05, 12, 12]} />
            <meshBasicMaterial
              color={active ? '#00E5A0' : '#A688FF'}
              transparent
              opacity={active ? 0.22 : 0.15}
            />
          </mesh>
          {/* Outer halo (active node only) */}
          {active && (
            <mesh>
              <sphereGeometry args={[0.10, 12, 12]} />
              <meshBasicMaterial color="#00E5A0" transparent opacity={0.06} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function ConnectionArc({
  fromIdx,
  toIdx,
  elevation,
  phaseOffset,
  animated,
}: {
  fromIdx: number
  toIdx: number
  elevation: number
  phaseOffset: number
  animated: boolean
}) {
  const tubeRef  = useRef<THREE.Mesh>(null)
  const packetRef = useRef<THREE.Mesh>(null)

  const { curve } = useMemo(() => {
    const from = latLngToVec3(SERVER_LOCATIONS[fromIdx]!.lat, SERVER_LOCATIONS[fromIdx]!.lng, 1.83)
    const to   = latLngToVec3(SERVER_LOCATIONS[toIdx]!.lat,  SERVER_LOCATIONS[toIdx]!.lng,  1.83)
    const mid  = new THREE.Vector3()
      .addVectors(from, to)
      .normalize()
      .multiplyScalar(1.83 + elevation)
    return { curve: new THREE.CatmullRomCurve3([from, mid, to]) }
  }, [fromIdx, toIdx, elevation])

  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 24, 0.005, 8, false),
    [curve],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.45 + 0.3 * Math.sin(t * 1.5 + phaseOffset)
    }

    if (packetRef.current && animated) {
      const progress = ((t * 0.2 + phaseOffset * 0.4) % 1 + 1) % 1
      const pos = curve.getPoint(progress)
      packetRef.current.position.copy(pos)

      // Scale packet to pulse
      const s = 0.8 + 0.3 * Math.sin(t * 4 + phaseOffset)
      packetRef.current.scale.setScalar(s)
    }
  })

  return (
    <group>
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshBasicMaterial color="#7C5CFF" transparent opacity={0.55} />
      </mesh>

      {animated && (
        <mesh ref={packetRef}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshBasicMaterial color="#C4B5FD" />
        </mesh>
      )}
    </group>
  )
}

function ConnectionArcs() {
  return (
    <group>
      {ARC_PAIRS.map(([from, to, elev], i) => (
        <ConnectionArc
          key={i}
          fromIdx={from}
          toIdx={to}
          elevation={elev}
          phaseOffset={i * 1.1}
          animated={i < 4}
        />
      ))}
    </group>
  )
}

// ── Main Globe Scene ──────────────────────────────────────────────────────────

function GlobeScene() {
  const globeRef = useRef<THREE.Group>(null)

  useFrame(({ clock, mouse }) => {
    if (!globeRef.current) return
    globeRef.current.rotation.y = clock.elapsedTime * 0.07

    // Subtle mouse tilt
    globeRef.current.rotation.x +=
      (mouse.y * 0.12 - globeRef.current.rotation.x) * 0.04
  })

  return (
    <group ref={globeRef}>
      <EarthSphere />
      <ServerDots />
      <ConnectionArcs />
    </group>
  )
}

// ── Canvas Export ─────────────────────────────────────────────────────────────

export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Brighter, more dramatic lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 3, 5]}  intensity={1.4} color="#A688FF" />
      <pointLight position={[-5, -2, 3]} intensity={0.6} color="#7C5CFF" />
      <pointLight position={[0, 4, -4]}  intensity={0.3} color="#00E5A0" />

      <Suspense fallback={null}>
        <GlobeScene />
      </Suspense>
    </Canvas>
  )
}
