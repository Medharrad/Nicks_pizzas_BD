import * as THREE from 'three';

export class Candles {
    constructor(scene, cakePosition) {
        this.scene = scene;
        this.cakePosition = cakePosition;
        this.candles = [];
        this.particles = [];
        this.lights = [];
        this.time = 0;
        
        this.createCandles();
    }

    createCandles() {
        const candleCount = 6;
        const radius = 0.8;
        
        for (let i = 0; i < candleCount; i++) {
            const angle = (Math.PI * 2 * i) / candleCount;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            this.createCandle(x, 2.85, z, i);
        }
    }

    createCandle(x, y, z, index) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        // Candle body
        const candleMaterial = new THREE.MeshStandardMaterial({
            color: 0xfff8dc,
            roughness: 0.7
        });
        const candleBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16),
            candleMaterial
        );
        candleBody.castShadow = true;
        group.add(candleBody);
        
        // Wick
        const wickMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333
        });
        const wick = new THREE.Mesh(
            new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8),
            wickMaterial
        );
        wick.position.y = 0.24;
        group.add(wick);
        
        // Point light for glow
        const light = new THREE.PointLight(0xffaa33, 1, 3);
        light.position.y = 0.3;
        light.castShadow = true;
        group.add(light);
        
        // Create flame particles
        const particleSystem = this.createFlameParticles();
        particleSystem.position.y = 0.3;
        group.add(particleSystem);
        
        this.scene.add(group);
        
        this.candles.push({
            group: group,
            light: light,
            particles: particleSystem,
            isLit: true,
            smokeParticles: null
        });
    }

    createFlameParticles() {
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        const lifetimes = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.05;
            positions[i * 3 + 1] = Math.random() * 0.15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
            
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: Math.random() * 0.1 + 0.05,
                z: (Math.random() - 0.5) * 0.02
            });
            
            lifetimes.push(Math.random());
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffaa33,
            size: 0.08,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = { velocities, lifetimes };
        
        return particles;
    }

    createSmokeParticles(x, y, z) {
        const particleCount = 30;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        const lifetimes = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.08;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
            
            velocities.push({
                x: (Math.random() - 0.5) * 0.03,
                y: Math.random() * 0.08 + 0.04,
                z: (Math.random() - 0.5) * 0.03
            });
            
            lifetimes.push(1.0);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x888888,
            size: 0.12,
            transparent: true,
            opacity: 0.5,
            blending: THREE.NormalBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.position.set(x, y, z);
        particles.userData = { velocities, lifetimes, age: 0 };
        
        this.scene.add(particles);
        return particles;
    }

    extinguishNext() {
        // Find first lit candle and extinguish it
        const litCandle = this.candles.find(c => c.isLit);
        
        if (litCandle) {
            litCandle.isLit = false;
            litCandle.light.intensity = 0;
            litCandle.particles.visible = false;
            
            // Create smoke effect
            const worldPos = new THREE.Vector3();
            litCandle.group.getWorldPosition(worldPos);
            litCandle.smokeParticles = this.createSmokeParticles(
                worldPos.x,
                worldPos.y + 0.3,
                worldPos.z
            );
        }
        
        // Check if all candles are out
        return this.candles.every(c => !c.isLit);
    }

    update(delta) {
        this.time += delta;
        
        // Update flame particles
        this.candles.forEach(candle => {
            if (candle.isLit && candle.particles) {
                this.updateFlameParticles(candle.particles, delta);
                
                // Flicker light
                candle.light.intensity = 1 + Math.sin(this.time * 10) * 0.2;
            }
            
            // Update smoke particles
            if (candle.smokeParticles) {
                this.updateSmokeParticles(candle.smokeParticles, delta);
            }
        });
    }

    updateFlameParticles(particles, delta) {
        const positions = particles.geometry.attributes.position.array;
        const { velocities, lifetimes } = particles.userData;
        
        for (let i = 0; i < positions.length / 3; i++) {
            // Update lifetime
            lifetimes[i] -= delta * 2;
            
            if (lifetimes[i] <= 0) {
                // Reset particle
                positions[i * 3] = (Math.random() - 0.5) * 0.05;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
                lifetimes[i] = 1.0;
            } else {
                // Move particle
                positions[i * 3] += velocities[i].x * delta;
                positions[i * 3 + 1] += velocities[i].y * delta;
                positions[i * 3 + 2] += velocities[i].z * delta;
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
    }

    updateSmokeParticles(particles, delta) {
        const positions = particles.geometry.attributes.position.array;
        const { velocities, lifetimes, age } = particles.userData;
        
        particles.userData.age += delta;
        
        // Fade out smoke over time
        particles.material.opacity = Math.max(0, 0.5 - age * 0.3);
        
        for (let i = 0; i < positions.length / 3; i++) {
            lifetimes[i] -= delta;
            
            if (lifetimes[i] > 0) {
                positions[i * 3] += velocities[i].x * delta;
                positions[i * 3 + 1] += velocities[i].y * delta;
                positions[i * 3 + 2] += velocities[i].z * delta;
            }
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Remove smoke after 3 seconds
        if (age > 3) {
            this.scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
        }
    }
}
