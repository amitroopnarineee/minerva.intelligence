import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
	fadeIn: { start: number; end: number };
	fadeOut: { start: number; end: number };
}

interface BlurSettings {
	blurIn: { start: number; end: number };
	blurOut: { start: number; end: number };
	maxBlur: number;
}

interface InfiniteGalleryProps {
	images: ImageItem[];
	speed?: number;
	zSpacing?: number;
	visibleCount?: number;
	falloff?: { near: number; far: number };
	fadeSettings?: FadeSettings;
	blurSettings?: BlurSettings;
	className?: string;
	style?: React.CSSProperties;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	x: number;
	y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const createClothMaterial = () => {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			map: { value: null },
			opacity: { value: 1.0 },
			blurAmount: { value: 0.0 },
			scrollForce: { value: 0.0 },
			time: { value: 0.0 },
			isHovered: { value: 0.0 },
		},
		vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }
        pos.z -= (curve + clothEffect + flagWave);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
	});
};

function ImagePlane({ texture, position, scale, material }: {
	texture: THREE.Texture;
	position: [number, number, number];
	scale: [number, number, number];
	material: THREE.ShaderMaterial;
}) {
	const meshRef = useRef<THREE.Mesh>(null);
	const [isHovered, setIsHovered] = useState(false);
	useEffect(() => { if (material && texture) material.uniforms.map.value = texture; }, [material, texture]);
	useEffect(() => { if (material?.uniforms) material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0; }, [material, isHovered]);
	return (
		<mesh ref={meshRef} position={position} scale={scale} material={material}
			onPointerEnter={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)}>
			<planeGeometry args={[1, 1, 32, 32]} />
		</mesh>
	);
}

function GalleryScene({ images, speed = 1, visibleCount = 8, fadeSettings = {
	fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 },
}, blurSettings = {
	blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0,
} }: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
	const [scrollVelocity, setScrollVelocity] = useState(0);
	const [autoPlay, setAutoPlay] = useState(true);
	const lastInteraction = useRef(Date.now());
	const normalizedImages = useMemo(() => images.map((img) => typeof img === 'string' ? { src: img, alt: '' } : img), [images]);
	const [textures, setTextures] = useState<(THREE.Texture | null)[]>([]);
	const videoRefs = useRef<HTMLVideoElement[]>([]);
	useEffect(() => {
		const loader = new THREE.TextureLoader();
		const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
		Promise.all(normalizedImages.map(img => {
			if (isVideo(img.src)) {
				return new Promise<THREE.Texture | null>(resolve => {
					try {
						const video = document.createElement('video');
						video.src = img.src;
						video.crossOrigin = 'anonymous';
						video.loop = true;
						video.muted = true;
						video.playsInline = true;
						video.autoplay = true;
						let resolved = false;
						const done = (tex: THREE.Texture | null) => { if (!resolved) { resolved = true; resolve(tex); } };
						video.addEventListener('canplay', () => {
							video.play().catch(() => {});
							const tex = new THREE.VideoTexture(video);
							tex.minFilter = THREE.LinearFilter;
							tex.magFilter = THREE.LinearFilter;
							videoRefs.current.push(video);
							done(tex);
						}, { once: true });
						video.addEventListener('error', () => done(null), { once: true });
						setTimeout(() => done(null), 5000);
						video.load();
					} catch { resolve(null); }
				});
			}
			return new Promise<THREE.Texture | null>(resolve => {
				loader.load(img.src, tex => resolve(tex), undefined, () => resolve(null));
			});
		})).then(results => setTextures(results));
		return () => { videoRefs.current.forEach(v => { v.pause(); v.src = ''; }); };
	}, [normalizedImages]);
	const materials = useMemo(() => Array.from({ length: visibleCount }, () => createClothMaterial()), [visibleCount]);

	const spatialPositions = useMemo(() => {
		const positions: { x: number; y: number }[] = [];
		for (let i = 0; i < visibleCount; i++) {
			const hAngle = (i * 2.618) % (Math.PI * 2);
			const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
			const hRadius = (i % 3) * 1.2;
			const vRadius = ((i + 1) % 4) * 0.8;
			positions.push({
				x: (Math.sin(hAngle) * hRadius * MAX_HORIZONTAL_OFFSET) / 3,
				y: (Math.cos(vAngle) * vRadius * MAX_VERTICAL_OFFSET) / 4,
			});
		}
		return positions;
	}, [visibleCount]);

	const totalImages = normalizedImages.length;
	const depthRange = DEFAULT_DEPTH_RANGE;

	const planesData = useRef<PlaneData[]>(
		Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}))
	);

	useEffect(() => {
		planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
			index: i, z: visibleCount > 0 ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0, y: spatialPositions[i]?.y ?? 0,
		}));
	}, [depthRange, spatialPositions, totalImages, visibleCount]);

	const handleWheel = useCallback((event: WheelEvent) => {
		event.preventDefault();
		setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
		setAutoPlay(false);
		lastInteraction.current = Date.now();
	}, [speed]);

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
			setScrollVelocity((prev) => prev - 2 * speed); setAutoPlay(false); lastInteraction.current = Date.now();
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
			setScrollVelocity((prev) => prev + 2 * speed); setAutoPlay(false); lastInteraction.current = Date.now();
		}
	}, [speed]);

	useEffect(() => {
		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.addEventListener('wheel', handleWheel, { passive: false });
			document.addEventListener('keydown', handleKeyDown);
			return () => { canvas.removeEventListener('wheel', handleWheel); document.removeEventListener('keydown', handleKeyDown); };
		}
	}, [handleWheel, handleKeyDown]);

	useEffect(() => {
		const interval = setInterval(() => { if (Date.now() - lastInteraction.current > 3000) setAutoPlay(true); }, 1000);
		return () => clearInterval(interval);
	}, []);

	useFrame((state, delta) => {
		if (autoPlay) setScrollVelocity((prev) => prev + 0.3 * delta);
		setScrollVelocity((prev) => prev * 0.95);
		const time = state.clock.getElapsedTime();
		materials.forEach((m) => { if (m?.uniforms) { m.uniforms.time.value = time; m.uniforms.scrollForce.value = scrollVelocity; } });
		const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
		const totalRange = depthRange;
		planesData.current.forEach((plane, i) => {
			let newZ = plane.z + scrollVelocity * delta * 10;
			let wF = 0, wB = 0;
			if (newZ >= totalRange) { wF = Math.floor(newZ / totalRange); newZ -= totalRange * wF; }
			else if (newZ < 0) { wB = Math.ceil(-newZ / totalRange); newZ += totalRange * wB; }
			if (wF > 0 && imageAdvance > 0 && totalImages > 0) plane.imageIndex = (plane.imageIndex + wF * imageAdvance) % totalImages;
			if (wB > 0 && imageAdvance > 0 && totalImages > 0) { const s = plane.imageIndex - wB * imageAdvance; plane.imageIndex = ((s % totalImages) + totalImages) % totalImages; }
			plane.z = ((newZ % totalRange) + totalRange) % totalRange;
			plane.x = spatialPositions[i]?.x ?? 0;
			plane.y = spatialPositions[i]?.y ?? 0;
			const np = plane.z / totalRange;
			let opacity = 1;
			if (np >= fadeSettings.fadeIn.start && np <= fadeSettings.fadeIn.end) opacity = (np - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
			else if (np < fadeSettings.fadeIn.start) opacity = 0;
			else if (np >= fadeSettings.fadeOut.start && np <= fadeSettings.fadeOut.end) opacity = 1 - (np - fadeSettings.fadeOut.start) / (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
			else if (np > fadeSettings.fadeOut.end) opacity = 0;
			opacity = Math.max(0, Math.min(1, opacity));
			let blur = 0;
			if (np >= blurSettings.blurIn.start && np <= blurSettings.blurIn.end) blur = blurSettings.maxBlur * (1 - (np - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start));
			else if (np < blurSettings.blurIn.start) blur = blurSettings.maxBlur;
			else if (np >= blurSettings.blurOut.start && np <= blurSettings.blurOut.end) blur = blurSettings.maxBlur * ((np - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start));
			else if (np > blurSettings.blurOut.end) blur = blurSettings.maxBlur;
			blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));
			const mat = materials[i];
			if (mat?.uniforms) { mat.uniforms.opacity.value = opacity; mat.uniforms.blurAmount.value = blur; }
		});
	});

	if (normalizedImages.length === 0 || textures.length === 0) return null;
	return (
		<>
			{planesData.current.map((plane, i) => {
				const texture = textures[plane.imageIndex];
				const material = materials[i];
				if (!texture || !material) return null;
				const worldZ = plane.z - depthRange / 2;
				const img = texture.image as HTMLImageElement | undefined;
				const aspect = img ? img.width / img.height : 1;
				const scale: [number, number, number] = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];
				return <ImagePlane key={plane.index} texture={texture} position={[plane.x, plane.y, worldZ]} scale={scale} material={material} />;
			})}
		</>
	);
}

const DEFAULT_FADE = { fadeIn: { start: 0.02, end: 0.12 }, fadeOut: { start: 0.75, end: 0.95 } };
const DEFAULT_BLUR = { blurIn: { start: 0.0, end: 0.08 }, blurOut: { start: 0.8, end: 0.95 }, maxBlur: 4.0 };

export default function InfiniteGallery({ images, className = 'h-96 w-full', style,
	fadeSettings = DEFAULT_FADE,
	blurSettings = DEFAULT_BLUR,
}: InfiniteGalleryProps) {
	const stableImages = useRef(images);
	const stableFade = useRef(fadeSettings);
	const stableBlur = useRef(blurSettings);
	const [webglOk, setWebglOk] = useState(true);
	useEffect(() => {
		try { const c = document.createElement('canvas'); if (!c.getContext('webgl') && !c.getContext('experimental-webgl')) setWebglOk(false); }
		catch { setWebglOk(false); }
	}, []);
	if (!webglOk) return <div className={className} style={style}><p className="text-white/30 text-center pt-20">WebGL not supported</p></div>;
	return (
		<div className={className} style={style}>
			<Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }}>
				<GalleryScene images={stableImages.current} fadeSettings={stableFade.current} blurSettings={stableBlur.current} />
			</Canvas>
		</div>
	);
}
