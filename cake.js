import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export class Cake {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.position = new THREE.Vector3(0, 0, 0);
        
        this.createCake();
        this.scene.add(this.group);
    }

    createCake() {
        // Create cake layers
        this.createCakeLayers();
        
        // Create frosting
        this.createFrosting();
        
        // Create strawberries
        this.createStrawberries();
        
        // Create text on top
        this.createText();
        
        // Create plate
        this.createPlate();
    }

    createCakeLayers() {
        // Bottom layer (larger)
        const bottomGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1, 32);
        const cakeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb3ba, // Strawberry pink
            roughness: 0.7,
            metalness: 0.1
        });
        const bottomLayer = new THREE.Mesh(bottomGeometry, cakeMaterial);
        bottomLayer.position.y = 0.5;
        bottomLayer.castShadow = true;
        bottomLayer.receiveShadow = true;
        this.group.add(bottomLayer);

        // Middle layer
        const middleGeometry = new THREE.CylinderGeometry(2.1, 2.1, 0.9, 32);
        const middleLayer = new THREE.Mesh(middleGeometry, cakeMaterial);
        middleLayer.position.y = 1.45;
        middleLayer.castShadow = true;
        middleLayer.receiveShadow = true;
        this.group.add(middleLayer);

        // Top layer (smallest)
        const topGeometry = new THREE.CylinderGeometry(1.7, 1.7, 0.8, 32);
        const topLayer = new THREE.Mesh(topGeometry, cakeMaterial);
        topLayer.position.y = 2.3;
        topLayer.castShadow = true;
        topLayer.receiveShadow = true;
        this.group.add(topLayer);
    }

    createFrosting() {
        // White frosting drips between layers
        const frostingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.2
        });

        // Frosting ring on bottom layer
        const frostingRing1 = new THREE.Mesh(
            new THREE.TorusGeometry(2.5, 0.1, 16, 32),
            frostingMaterial
        );
        frostingRing1.position.y = 1.0;
        frostingRing1.rotation.x = Math.PI / 2;
        this.group.add(frostingRing1);

        // Frosting ring on middle layer
        const frostingRing2 = new THREE.Mesh(
            new THREE.TorusGeometry(2.1, 0.09, 16, 32),
            frostingMaterial
        );
        frostingRing2.position.y = 1.9;
        frostingRing2.rotation.x = Math.PI / 2;
        this.group.add(frostingRing2);

        // Top frosting layer
        const topFrosting = new THREE.Mesh(
            new THREE.CylinderGeometry(1.7, 1.7, 0.12, 32),
            frostingMaterial
        );
        topFrosting.position.y = 2.76;
        this.group.add(topFrosting);

        // Add decorative frosting swirls around bottom layer
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const swirl = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                frostingMaterial
            );
            swirl.position.set(
                Math.cos(angle) * 2.5,
                1.0,
                Math.sin(angle) * 2.5
            );
            this.group.add(swirl);
        }

        // Add decorative frosting swirls around middle layer
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            const swirl = new THREE.Mesh(
                new THREE.SphereGeometry(0.07, 8, 8),
                frostingMaterial
            );
            swirl.position.set(
                Math.cos(angle) * 2.1,
                1.9,
                Math.sin(angle) * 2.1
            );
            this.group.add(swirl);
        }
    }

    createStrawberries() {
        // Create 6 simple geometric strawberries around the top
        const strawberryMaterial = new THREE.MeshStandardMaterial({
            color: 0xff3366,
            roughness: 0.8,
            metalness: 0.1
        });

        const leafMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
            roughness: 0.9
        });

        const positions = [
            { x: 1.0, z: 0 },
            { x: 0.5, z: 0.87 },
            { x: -0.5, z: 0.87 },
            { x: -1.0, z: 0 },
            { x: -0.5, z: -0.87 },
            { x: 0.5, z: -0.87 }
        ];

        positions.forEach(pos => {
            // Strawberry body (cone shape)
            const strawberry = new THREE.Mesh(
                new THREE.ConeGeometry(0.15, 0.25, 8),
                strawberryMaterial
            );
            strawberry.position.set(pos.x, 2.95, pos.z);
            strawberry.rotation.x = Math.PI;
            this.group.add(strawberry);

            // Small leaf on top
            const leaf = new THREE.Mesh(
                new THREE.ConeGeometry(0.1, 0.06, 6),
                leafMaterial
            );
            leaf.position.set(pos.x, 3.1, pos.z);
            this.group.add(leaf);

            // Seeds (tiny spheres)
            for (let i = 0; i < 6; i++) {
                const seed = new THREE.Mesh(
                    new THREE.SphereGeometry(0.015, 4, 4),
                    new THREE.MeshStandardMaterial({ color: 0xffff88 })
                );
                const angle = (Math.PI * 2 * i) / 6;
                seed.position.set(
                    pos.x + Math.cos(angle) * 0.08,
                    2.92,
                    pos.z + Math.sin(angle) * 0.08
                );
                this.group.add(seed);
            }
        });
    }

    createText() {
        // Create text using canvas texture (simpler than loading font)
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.fillStyle = '#ff1493';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Happy Birthday', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = 'bold 56px Arial';
        ctx.fillText('Zaynab', canvas.width / 2, canvas.height / 2 + 30);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 1
        });

        // Create plane for text
        const textPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(3.0, 1.5),
            textMaterial
        );
        textPlane.position.y = 2.82;
        textPlane.rotation.x = -Math.PI / 2;
        this.group.add(textPlane);
    }

    createPlate() {
        // Create a decorative plate under the cake
        const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700, // Gold
            roughness: 0.3,
            metalness: 0.8
        });

        const plate = new THREE.Mesh(
            new THREE.CylinderGeometry(3.2, 3.2, 0.12, 32),
            plateMaterial
        );
        plate.position.y = 0.06;
        plate.castShadow = false;
        plate.receiveShadow = true;
        this.group.add(plate);

        // Plate rim
        const rim = new THREE.Mesh(
            new THREE.TorusGeometry(3.2, 0.06, 16, 32),
            plateMaterial
        );
        rim.position.y = 0.12;
        rim.rotation.x = Math.PI / 2;
        this.group.add(rim);

        // Add decorative pattern on plate edge
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16;
            const decoration = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                plateMaterial
            );
            decoration.position.set(
                Math.cos(angle) * 3.1,
                0.12,
                Math.sin(angle) * 3.1
            );
            this.group.add(decoration);
        }
    }
}
