import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useMediaQuery'

/* =========================================================
   Tecido de seda em WebGL — o pano de fundo do herói.
   A ondulação é feita no vertex shader (soma de três senos
   com fases diferentes) e o brilho acompanha a inclinação da
   onda, então a luz corre pelo tecido como em cetim real.
   ========================================================= */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 p = position;

    float w =
      sin(p.x * 1.55 + uTime * 0.75) * 0.34 +
      sin(p.y * 2.10 - uTime * 0.55) * 0.24 +
      sin((p.x + p.y) * 1.05 + uTime * 0.38) * 0.18;

    // a barra do tecido balança mais que o topo, que está preso
    w *= uAmp * smoothstep(0.0, 0.42, 1.0 - vUv.y);

    p.z += w;
    vWave = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    float g = clamp(vUv.y + vWave * 0.30, 0.0, 1.0);
    vec3 col = mix(uA, uB, smoothstep(0.0, 0.58, g));
    col = mix(col, uC, smoothstep(0.52, 1.0, g));

    // brilho do fio: acompanha a crista da onda
    float sheen = smoothstep(0.05, 0.55, vWave);
    col += sheen * 0.18;

    // as bordas somem para o tecido não ter recorte reto
    float fadeX = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    float fadeY = smoothstep(0.0, 0.16, vUv.y) * smoothstep(1.0, 0.86, vUv.y);

    gl_FragColor = vec4(col, fadeX * fadeY * uOpacity);
  }
`

interface ClothProps {
  colors: [string, string, string]
  amplitude: number
  opacity: number
  still: boolean
}

function Cloth({ colors, amplitude, opacity, still }: ClothProps) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amplitude },
      uOpacity: { value: opacity },
      uA: { value: new THREE.Color(colors[0]) },
      uB: { value: new THREE.Color(colors[1]) },
      uC: { value: new THREE.Color(colors[2]) },
    }),
    [colors, amplitude, opacity],
  )

  useFrame((state, delta) => {
    if (still) return
    if (mat.current) mat.current.uniforms.uTime.value += delta
    if (mesh.current) {
      // paralaxe suave: o tecido acompanha o ponteiro com atraso
      mesh.current.rotation.y += (state.pointer.x * 0.22 - mesh.current.rotation.y) * 0.03
      mesh.current.rotation.x += (-state.pointer.y * 0.14 - mesh.current.rotation.x) * 0.03
    }
  })

  return (
    <mesh ref={mesh} rotation={[0, 0, -0.14]}>
      <planeGeometry args={[7.4, 9.6, 90, 110]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Poeira de ateliê: partículas suspensas na luz. */
function Motes({ count = 70, still }: { count?: number; still: boolean }) {
  const pts = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = Math.random() * 2.4
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (still || !pts.current) return
    const t = state.clock.elapsedTime
    pts.current.rotation.z = t * 0.012
    pts.current.position.y = Math.sin(t * 0.18) * 0.28
  })

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#E6D0B3"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

interface SilkSceneProps {
  colors?: [string, string, string]
  amplitude?: number
  opacity?: number
  className?: string
}

export default function SilkScene({
  colors = ['#F2DDE8', '#CF92B3', '#9D5B81'],
  amplitude = 1,
  opacity = 0.92,
  className,
}: SilkSceneProps) {
  const reduced = useReducedMotion()

  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <Cloth colors={colors} amplitude={amplitude} opacity={opacity} still={reduced} />
      <Motes still={reduced} />
    </Canvas>
  )
}
