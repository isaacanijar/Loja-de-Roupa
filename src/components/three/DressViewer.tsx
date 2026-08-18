import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { SHAPES, type GarmentShape, type ShapeKey } from '@/lib/garment'
import type { Colorway } from '@/types/catalog'
import { useReducedMotion } from '@/hooks/useMediaQuery'

/* =========================================================
   Visualizador 3D da peça.

   A MESMA modelagem paramétrica que gera o desenho 2D é
   revolucionada em torno do eixo vertical: o perfil lateral
   (decote → ombro → busto → cintura → quadril → barra) vira
   uma superfície de revolução. Trocar a peça no site troca
   as medidas — e o volume 3D acompanha, sem novo modelo.
   ========================================================= */

const S = 90 // divisor de escala: unidades de modelagem → unidades de cena

function profileOf(g: GarmentShape): THREE.Vector2[] {
  const base = g.hemY + g.hemCurve
  const key: [number, number][] = [
    [g.neckWidth * 0.92, 0],
    [g.shoulder, g.shoulderDrop],
    [g.bust, g.armhole],
    [g.waist, g.waistY],
    [g.hip, g.hipY],
    [g.hem, g.hemY],
    [g.hem * 0.99, base],
  ]

  const pts = key.map(([w, y]) => new THREE.Vector2(Math.max(w, 2) / S, (base - y) / S))
  // suaviza o perfil para o volume não ter quinas de costura
  return new THREE.SplineCurve(pts).getPoints(56)
}

interface BodyProps {
  shape: GarmentShape
  colorway: Colorway
}

function Garment({ shape, colorway }: BodyProps) {
  const geometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(profileOf(shape), 96)
    geo.computeVertexNormals()
    return geo
  }, [shape])

  const sleeves = useMemo(() => {
    if (shape.sleeveLength < 60) return null
    const len = (shape.sleeveLength - shape.shoulderDrop) / S
    const top = (shape.sleeveOuter - shape.shoulder) / S + 0.16
    const bottom = Math.max((shape.sleeveOuter - shape.sleeveInner) / S, 0.06)
    return { len, top, bottom }
  }, [shape])

  const base = (shape.hemY + shape.hemCurve) / S
  const shoulderY = base - shape.shoulderDrop / S
  const shoulderX = shape.shoulder / S

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorway.hex),
        sheen: 1,
        sheenColor: new THREE.Color(colorway.sheen),
        sheenRoughness: 0.45,
        roughness: 0.62,
        metalness: 0,
        clearcoat: 0.16,
        clearcoatRoughness: 0.6,
        side: THREE.DoubleSide,
      }),
    [colorway],
  )

  return (
    <group position={[0, -base / 2, 0]}>
      {/* corpo da peça, achatado em Z para virar torso e não cilindro */}
      <mesh geometry={geometry} material={material} scale={[1, 1, 0.66]} castShadow />

      {sleeves && (
        <>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              material={material}
              position={[side * shoulderX * 0.86, shoulderY - sleeves.len / 2, 0]}
              rotation={[0, 0, side * -0.16]}
              castShadow
            >
              <cylinderGeometry args={[sleeves.top, sleeves.bottom, sleeves.len, 32, 1, true]} />
            </mesh>
          ))}
        </>
      )}

      {/* base do manequim do ateliê */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.06, 24]} />
        <meshStandardMaterial color="#3D2A22" roughness={0.5} metalness={0.35} />
      </mesh>
    </group>
  )
}

function Rig({ still }: { still: boolean }) {
  const { current: target } = useRef(new THREE.Vector3())
  useFrame((state) => {
    if (still) return
    target.set(state.pointer.x * 0.35, 0.1 + state.pointer.y * 0.2, 4.4)
    state.camera.position.lerp(target, 0.035)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

interface DressViewerProps {
  shape: ShapeKey | GarmentShape
  colorway: Colorway
  className?: string
  /** deixa a cliente girar a peça com o dedo/mouse */
  interactive?: boolean
}

export default function DressViewer({
  shape,
  colorway,
  className,
  interactive = true,
}: DressViewerProps) {
  const reduced = useReducedMotion()
  const g: GarmentShape = typeof shape === 'string' ? SHAPES[shape] : shape

  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [0, 0.1, 4.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3.2, 4.5, 3]} intensity={1.5} castShadow />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.55} color="#E3B7CE" />
      <pointLight position={[0, -2, 2.5]} intensity={0.4} color="#E6D0B3" />

      <Garment shape={g} colorway={colorway} />

      <ContactShadows
        position={[0, -1.92, 0]}
        opacity={0.35}
        scale={7}
        blur={2.6}
        far={3}
        color="#2B1620"
      />

      {interactive ? (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reduced}
          autoRotateSpeed={0.9}
          minPolarAngle={Math.PI / 2.9}
          maxPolarAngle={Math.PI / 1.9}
        />
      ) : (
        <Rig still={reduced} />
      )}
    </Canvas>
  )
}
