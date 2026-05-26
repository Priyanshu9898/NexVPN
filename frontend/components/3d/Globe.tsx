'use client'

// NOTE: Import this component with dynamic() + ssr:false in Next.js pages:
//   const Globe = dynamic(() => import('@/components/3d/Globe'), { ssr: false })

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Helpers ──────────────────────────────────────────────────────────────────

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
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

// Arc pairs: [fromIndex, toIndex, elevationOut]
const ARC_PAIRS: [number, number, number][] = [
  [1, 3, 0.65],  // Frankfurt → New York
  [0, 6, 0.7],   // London → Singapore
  [4, 5, 0.75],  // San Francisco → Tokyo
  [9, 10, 0.6],  // Dubai → São Paulo
  [11, 7, 0.7],  // Moscow → Sydney
]

// ── Sub-components ────────────────────────────────────────────────────────────

function EarthSphere() {
  return (
    <group>
      {/* Layer 1: Dark inner globe */}
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial color="#060D18" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Layer 2: Wireframe grid overlay */}
      <mesh>
        <sphereGeometry args={[1.82, 32, 32]} />
        <meshBasicMaterial color="#7C5CFF" wireframe transparent opacity={0.07} />
      </mesh>

      {/* Layer 3: Atmosphere glow (BackSide, additive-ish) */}
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshBasicMaterial
          color="#7C5CFF"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

function ServerDots() {
  const dots = useMemo(
    () =>
      SERVER_LOCATIONS.map(({ lat, lng }) => ({
        pos: latLngToVec3(lat, lng, 1.82),
      })),
    [],
  )

  return (
    <group>
      {dots.map(({ pos }, i) => (
        <group key={i} position={pos}>
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial
              color={i === 1 ? '#00E5A0' : '#7C5CFF'}
              emissive={i === 1 ? '#00E5A0' : '#7C5CFF'}
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Glow halo */}
          <mesh>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color={i === 1 ? '#00E5A0' : '#A688FF'} transparent opacity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Single arc between two server locations
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
  const tubeRef = useRef<THREE.Mesh>(null)
  const packetRef = useRef<THREE.Mesh>(null)

  const { curve } = useMemo(() => {
    const from = latLngToVec3(
      SERVER_LOCATIONS[fromIdx]!.lat,
      SERVER_LOCATIONS[fromIdx]!.lng,
      1.82,
    )
    const to = latLngToVec3(
      SERVER_LOCATIONS[toIdx]!.lat,
      SERVER_LOCATIONS[toIdx]!.lng,
      1.82,
    )
    const mid = new THREE.Vector3()
      .addVectors(from, to)
      .normalize()
      .multiplyScalar(1.82 + elevation)

    const curve = new THREE.CatmullRomCurve3([from, mid, to])
    return { curve, from, to }
  }, [fromIdx, toIdx, elevation])

  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 20, 0.004, 6, false),
    [curve],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    // Pulse the tube opacity
    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.35 + 0.25 * Math.sin(t * 1.5 + phaseOffset)
    }

    // Move data packet along the curve
    if (packetRef.current && animated) {
      const progress = ((t * 0.22 + phaseOffset * 0.5) % 1 + 1) % 1
      const pos = curve.getPoint(progress)
      packetRef.current.position.copy(pos)
    }
  })

  return (
    <group>
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshBasicMaterial color="#7C5CFF" transparent opacity={0.6} />
      </mesh>

      {animated && (
        <mesh ref={packetRef}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#A688FF" />
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
          phaseOffset={i * 1.2}
          animated={i < 3}
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

    // Slow auto-rotation
    globeRef.current.rotation.y = clock.elapsedTime * 0.08

    // Subtle mouse tilt
    globeRef.current.rotation.x +=
      (mouse.y * 0.15 - globeRef.current.rotation.x) * 0.05
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
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 3, 5]} intensity={0.8} color="#00D4FF" />
      <pointLight position={[-5, -3, -2]} intensity={0.3} color="#0066AA" />
      <Suspense fallback={null}>
        <GlobeScene />
      </Suspense>
    </Canvas>
  )
}
