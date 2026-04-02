'use client';
import React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };
interface InfiniteGalleryProps {
	images: ImageItem[];
	speed?: number;
	className?: string;
	style?: React.CSSProperties;
}

const DEPTH = 50;
const H_SPREAD = 8;
const V_SPREAD = 8;

function ImagePlane({ texture, position, scale, material }: {
	texture: THREE.Texture; position: [number, number, number]; scale: [number, number, number]; material: THREE.ShaderMaterial;
}) {
	const ref = useRef<THREE.Mesh>(null);
	const [hovered, setHovered] = useState(false);
	useEffect(() => { if (material && texture) material.uniforms.map.value = texture; }, [material, texture]);
	useEffect(() => { if (material?.uniforms) material.uniforms.isHovered.value = hovered ? 1.0 : 0.0; }, [material, hovered]);
	return (
		<mesh ref={ref} position={position} scale={scale} material={material}
			onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
			<planeGeometry args={[1, 1, 32, 32]} />
		</mesh>
	);
}

const createMat = () => new THREE.ShaderMaterial({
	transparent: true,
	uniforms: { map: { value: null }, opacity: { value: 1 }, blurAmount: { value: 0 }, scrollForce: { value: 0 }, time: { value: 0 }, isHovered: { value: 0 } },
	vertexShader: `
		uniform float scrollForce, time, isHovered;
		varying vec2 vUv;
		void main() {
			vUv = uv;
			vec3 p = position;
			float ci = scrollForce * 0.3;
			float d = length(p.xy);
			p.z -= d * d * ci + (sin(p.x*2.0+scrollForce*3.0)*0.02 + sin(p.y*2.5+scrollForce*2.0)*0.015) * abs(ci) * 2.0;
			if (isHovered > 0.5) {
				float w = sin(p.x*3.0+time*8.0)*0.1*smoothstep(-0.5,0.5,p.x);
				p.z -= w + sin(p.x*5.0+time*12.0)*0.03*smoothstep(-0.5,0.5,p.x);
			}
			gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
		}`,
	fragmentShader: `
		uniform sampler2D map;
		uniform float opacity, blurAmount, scrollForce;
		varying vec2 vUv;
		void main() {
			vec4 c = texture2D(map, vUv);
			if (blurAmount > 0.0) {
				vec2 ts = 1.0/vec2(textureSize(map,0));
				vec4 b = vec4(0.0); float t = 0.0;
				for (float x=-2.0;x<=2.0;x+=1.0) for (float y=-2.0;y<=2.0;y+=1.0) {
					float w = 1.0/(1.0+length(vec2(x,y)));
					b += texture2D(map, vUv + vec2(x,y)*ts*blurAmount) * w; t += w;
				}
				c = b/t;
			}
			c.rgb += vec3(abs(scrollForce)*0.005);
			gl_FragColor = vec4(c.rgb, c.a * opacity);
		}`,
});

function GalleryScene({ images, speed = 0.8 }: { images: ImageItem[]; speed?: number }) {
	const normalized = useMemo(() => images.map(i => typeof i === 'string' ? { src: i } : i), [images]);
	// Filter out video files — only load static images via useLoader
	const imgUrls = useMemo(() => normalized.filter(i => !/\.(mp4|webm|mov)$/i.test(i.src)).map(i => i.src), [normalized]);
	// useLoader suspends until ALL textures are loaded — no state race condition
	const textures = useLoader(THREE.TextureLoader, imgUrls);
	const totalImages = textures.length;
	const visibleCount = 10;

	const materials = useMemo(() => Array.from({ length: visibleCount }, () => createMat()), []);
	const positions = useMemo(() => {
		const p: { x: number; y: number }[] = [];
		for (let i = 0; i < visibleCount; i++) {
			const ha = (i * 2.618) % (Math.PI * 2);
			const va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
			const hr = (i % 3) * 1.2;
			const vr = ((i + 1) % 4) * 0.8;
			p.push({ x: (Math.sin(ha) * hr * H_SPREAD) / 3, y: (Math.cos(va) * vr * V_SPREAD) / 4 });
		}
		return p;
	}, []);

	const planes = useRef(Array.from({ length: visibleCount }, (_, i) => ({
		index: i, z: (DEPTH / visibleCount) * i, imageIndex: totalImages > 0 ? i % totalImages : 0,
		x: positions[i]?.x ?? 0, y: positions[i]?.y ?? 0,
	})));

	const velocity = useRef(0);
	const autoPlay = useRef(true);
	const lastInteract = useRef(Date.now());

	const onWheel = useCallback((e: WheelEvent) => {
		e.preventDefault();
		velocity.current += e.deltaY * 0.01 * speed;
		autoPlay.current = false;
		lastInteract.current = Date.now();
	}, [speed]);

	useEffect(() => {
		const canvas = document.querySelector('canvas');
		if (!canvas) return;
		canvas.addEventListener('wheel', onWheel, { passive: false });
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { velocity.current -= 2 * speed; autoPlay.current = false; lastInteract.current = Date.now(); }
			if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { velocity.current += 2 * speed; autoPlay.current = false; lastInteract.current = Date.now(); }
		};
		document.addEventListener('keydown', onKey);
		const iv = setInterval(() => { if (Date.now() - lastInteract.current > 3000) autoPlay.current = true; }, 1000);
		return () => { canvas.removeEventListener('wheel', onWheel); document.removeEventListener('keydown', onKey); clearInterval(iv); };
	}, [onWheel, speed]);

	useFrame((state, delta) => {
		if (autoPlay.current) velocity.current += 0.3 * delta;
		velocity.current *= 0.95;
		const t = state.clock.getElapsedTime();
		const adv = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
		materials.forEach(m => { if (m?.uniforms) { m.uniforms.time.value = t; m.uniforms.scrollForce.value = velocity.current; } });
		planes.current.forEach((pl, i) => {
			let nz = pl.z + velocity.current * delta * 10;
			let wF = 0, wB = 0;
			if (nz >= DEPTH) { wF = Math.floor(nz / DEPTH); nz -= DEPTH * wF; }
			else if (nz < 0) { wB = Math.ceil(-nz / DEPTH); nz += DEPTH * wB; }
			if (wF > 0 && adv > 0 && totalImages > 0) pl.imageIndex = (pl.imageIndex + wF * adv) % totalImages;
			if (wB > 0 && adv > 0 && totalImages > 0) { const s = pl.imageIndex - wB * adv; pl.imageIndex = ((s % totalImages) + totalImages) % totalImages; }
			pl.z = ((nz % DEPTH) + DEPTH) % DEPTH;
			const np = pl.z / DEPTH;
			let op = 1;
			if (np < 0.02) op = 0;
			else if (np < 0.12) op = (np - 0.02) / 0.1;
			else if (np > 0.85) op = 1 - (np - 0.85) / 0.15;
			else if (np > 1) op = 0;
			let blur = 0;
			if (np < 0.08) blur = 4 * (1 - np / 0.08);
			else if (np > 0.85) blur = 4 * ((np - 0.85) / 0.15);
			const mat = materials[i];
			if (mat?.uniforms) { mat.uniforms.opacity.value = Math.max(0, Math.min(1, op)); mat.uniforms.blurAmount.value = Math.max(0, Math.min(4, blur)); }
		});
	});

	if (totalImages === 0) return null;
	return (
		<>
			{planes.current.map((pl, i) => {
				const tex = textures[pl.imageIndex];
				const mat = materials[i];
				if (!tex || !mat) return null;
				const wz = pl.z - DEPTH / 2;
				const img = tex.image as HTMLImageElement | undefined;
				const asp = img ? img.width / img.height : 1;
				const sc: [number, number, number] = asp > 1 ? [2 * asp, 2, 1] : [2, 2 / asp, 1];
				return <ImagePlane key={pl.index} texture={tex} position={[pl.x, pl.y, wz]} scale={sc} material={mat} />;
			})}
		</>
	);
}

class GalleryErrorBoundary extends React.Component<{ children: React.ReactNode }, { err: boolean }> {
	state = { err: false };
	static getDerivedStateFromError() { return { err: true }; }
	render() { return this.state.err ? null : this.props.children; }
}

export default function InfiniteGallery({ images, className = 'h-96 w-full', style }: InfiniteGalleryProps) {
	const [ok, setOk] = useState(true);
	useEffect(() => {
		try { const c = document.createElement('canvas'); if (!c.getContext('webgl') && !c.getContext('experimental-webgl')) setOk(false); } catch { setOk(false); }
	}, []);
	if (!ok) return null;
	return (
		<div className={className} style={style}>
			<GalleryErrorBoundary>
				<Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }}>
					<React.Suspense fallback={null}>
						<GalleryScene images={images} />
					</React.Suspense>
				</Canvas>
			</GalleryErrorBoundary>
		</div>
	);
}
