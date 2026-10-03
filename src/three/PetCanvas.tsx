import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { petSpecies3d, type PetSpeciesKey } from './species'

type PetCanvasProps = {
  accessory?: string
  compact?: boolean
  species?: PetSpeciesKey
  action?: 'idle' | 'feed' | 'drink' | 'play' | 'bath' | 'sleep'
}

export default function PetCanvas({ accessory = '🧥', compact = false, species = 'fox', action = 'idle' }: PetCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const speciesConfig = petSpecies3d[species]

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.set(0, 1.25, 5.7)
    camera.lookAt(0, 1.1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const ambient = new THREE.HemisphereLight('#fff8ed', '#6b9287', 2.3)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight('#fff3d0', 3.4)
    keyLight.position.set(-3, 5, 4)
    keyLight.castShadow = true
    scene.add(keyLight)
    const rimLight = new THREE.PointLight('#9bd8df', 2.2, 8)
    rimLight.position.set(3, 2.5, -2)
    scene.add(rimLight)

    const pet = new THREE.Group()
    pet.position.y = -1.05
    scene.add(pet)
    let loadedModel: THREE.Object3D | null = null
    let cancelled = false

    const bodyMaterial = new THREE.MeshStandardMaterial({ color: speciesConfig.body, roughness: 0.8 })
    const bellyMaterial = new THREE.MeshStandardMaterial({ color: speciesConfig.belly, roughness: 0.85 })
    const darkMaterial = new THREE.MeshStandardMaterial({ color: '#263f43', roughness: 0.55 })
    const innerEarMaterial = new THREE.MeshStandardMaterial({ color: speciesConfig.innerEar, roughness: 0.85 })

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.84, 32, 24), bodyMaterial)
    body.scale.set(0.83, 1.03, 0.72)
    body.position.y = 1.02
    body.castShadow = true
    pet.add(body)

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 18), bellyMaterial)
    belly.scale.set(0.8, 1.12, 0.22)
    belly.position.set(0, 0.96, 0.57)
    pet.add(belly)

    const head = new THREE.Mesh(new THREE.SphereGeometry(1.04, 32, 24), bodyMaterial)
    head.scale.set(...speciesConfig.headScale)
    head.position.y = 2.35
    head.castShadow = true
    pet.add(head)

    const earGeometry = new THREE.ConeGeometry(0.43, 0.85, 4)
    const addEar = (x: number, flip = false) => {
      const ear = new THREE.Mesh(earGeometry, bodyMaterial)
      ear.position.set(x, 3.18, 0)
      ear.scale.set(...speciesConfig.earScale)
      ear.rotation.z = flip ? -0.32 : 0.32
      ear.rotation.y = flip ? -0.1 : 0.1
      ear.castShadow = true
      pet.add(ear)
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), innerEarMaterial)
      inner.position.set(x, 3.16, 0.27)
      inner.scale.set(...speciesConfig.earScale)
      inner.rotation.z = flip ? -0.32 : 0.32
      inner.rotation.y = flip ? -0.1 : 0.1
      pet.add(inner)
    }
    addEar(-0.62)
    addEar(0.62, true)

    const addEye = (x: number) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), darkMaterial)
      eye.scale.setScalar(speciesConfig.eyeScale)
      eye.position.set(x, 2.45, 0.86)
      pet.add(eye)
      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }))
      glint.position.set(x - 0.03, 2.5, 0.95)
      pet.add(glint)
    }
    addEye(-0.35)
    addEye(0.35)

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshStandardMaterial({ color: '#a7584d' }))
    nose.scale.set(1.2, 0.75, 0.8)
    nose.position.set(0, 2.18, 0.95)
    pet.add(nose)

    const addFoot = (x: number) => {
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 14), bodyMaterial)
      foot.scale.set(0.85, 1.25, 0.8)
      foot.position.set(x, 0.13, 0.22)
      foot.castShadow = true
      pet.add(foot)
    }
    addFoot(-0.39)
    addFoot(0.39)

    const tail = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.16, 14, 28, Math.PI * 1.35), bodyMaterial)
    tail.position.set(0.82, 1.1, -0.25)
    tail.rotation.set(0, Math.PI / 2, -0.5)
    tail.castShadow = true
    pet.add(tail)

    const accessoryBubble = document.createElement('div')
    accessoryBubble.className = 'three-accessory'
    accessoryBubble.textContent = accessory
    container.appendChild(accessoryBubble)

    const ground = new THREE.Mesh(new THREE.CircleGeometry(1.1, 48), new THREE.MeshBasicMaterial({ color: '#79aa95', transparent: true, opacity: 0.35 }))
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.02
    ground.scale.set(1.25, 0.5, 1)
    scene.add(ground)

    if (speciesConfig.asset) {
      const loader = new GLTFLoader()
      loader.loadAsync(speciesConfig.asset).then((gltf) => {
        if (cancelled) return
        loadedModel = gltf.scene
        loadedModel.position.set(0, -1.05, 0)
        loadedModel.scale.setScalar(1.25)
        loadedModel.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true
            object.receiveShadow = true
          }
        })
        scene.add(loadedModel)
        pet.visible = false
      }).catch(() => {
        if (!cancelled) pet.visible = true
      })
    }

    const resize = () => {
      const width = container.clientWidth || 320
      const height = container.clientHeight || (compact ? 250 : 330)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    let frame = 0
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      const beat = Math.sin(time * 0.008)
      const active = action !== 'idle'
      pet.position.y = -1.05 + (action === 'sleep' ? -0.08 : Math.sin(time * 0.0018) * 0.035)
      pet.rotation.y = action === 'play' ? beat * 0.2 : Math.sin(time * 0.00055) * 0.12
      pet.rotation.z = action === 'drink' ? Math.sin(time * 0.004) * 0.08 : 0
      pet.scale.setScalar(action === 'feed' ? 1 + Math.max(0, beat) * 0.06 : active && action !== 'sleep' ? 1 + Math.abs(beat) * 0.025 : 1)
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      renderer.dispose()
      container.removeChild(renderer.domElement)
      container.removeChild(accessoryBubble)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
          else object.material.dispose()
        }
      })
    }
  }, [accessory, action, compact, species])

  return <div className={compact ? 'three-pet-canvas compact' : 'three-pet-canvas'} ref={containerRef} aria-label="Animated 3D model of Miso" />
}
