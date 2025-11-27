import * as THREE from 'three';

export class Room {
    constructor(scene) {
        this.scene = scene;
        this.balloons = [];
        this.time = 0;
        
        this.createRoom();
        this.createDecorations();
    }

    createRoom() {
        // Floor with party pattern
        const floorGeometry = new THREE.CircleGeometry(15, 64);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            roughness: 0.3,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Add checkered pattern to floor
        const floorPattern = new THREE.Group();
        for (let i = -7; i <= 7; i++) {
            for (let j = -7; j <= 7; j++) {
                if ((i + j) % 2 === 0) {
                    const tileGeometry = new THREE.PlaneGeometry(1, 1);
                    const tileMaterial = new THREE.MeshStandardMaterial({
                        color: 0x3a3a4e,
                        roughness: 0.4
                    });
                    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
                    tile.rotation.x = -Math.PI / 2;
                    tile.position.set(i, 0.01, j);
                    tile.receiveShadow = true;
                    floorPattern.add(tile);
                }
            }
        }
        this.scene.add(floorPattern);

        // Curved backdrop wall
        const wallGeometry = new THREE.CylinderGeometry(12, 12, 8, 32, 1, true, 0, Math.PI);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a2c5e,
            side: THREE.BackSide,
            roughness: 0.8
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(0, 4, -5);
        wall.receiveShadow = true;
        this.scene.add(wall);

        // Add ambient room glow
        const glowGeometry = new THREE.SphereGeometry(20, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, 4, 0);
        this.scene.add(glow);
    }

    createDecorations() {
        // Add colorful balloons around the room
        this.createBalloons();
        
        // Add party banners/flags
        this.createBanners();
        
        // Add floating confetti particles
        this.createFloatingConfetti();
        
        // Add spotlights
        this.createSpotlights();
        
        // Add stars on the wall
        this.createWallStars();
    }

    createBalloons() {
        const balloonColors = [
            0xff6b9d, // Pink
            0x4ecdc4, // Turquoise
            0xffe66d, // Yellow
            0xc44569, // Dark Pink
            0x574b90, // Purple
            0xff6348, // Orange
        ];

        const positions = [
            { x: -4, z: -6, height: 5 },
            { x: 4, z: -6, height: 5.5 },
            { x: -5, z: -4, height: 4.5 },
            { x: 5, z: -3, height: 6 },
            { x: -6, z: 0, height: 5 },
            { x: 6, z: 1, height: 5.5 },
            { x: -4, z: 3, height: 4.8 },
            { x: 4, z: 4, height: 5.2 },
        ];

        positions.forEach((pos, index) => {
            const color = balloonColors[index % balloonColors.length];
            const balloon = this.createBalloon(color, pos.x, pos.height, pos.z);
            this.balloons.push({
                mesh: balloon,
                baseHeight: pos.height,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5
            });
            this.scene.add(balloon);
        });
    }

    createBalloon(color, x, y, z) {
        const group = new THREE.Group();

        // Balloon body
        const balloonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        balloonGeometry.scale(1, 1.2, 1);
        const balloonMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.2,
            metalness: 0.6,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const balloonMesh = new THREE.Mesh(balloonGeometry, balloonMaterial);
        balloonMesh.castShadow = true;
        group.add(balloonMesh);

        // Balloon knot
        const knotGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        knotGeometry.scale(1, 0.5, 1);
        const knotMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8
        });
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        knot.position.y = -0.5;
        group.add(knot);

        // String
        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
        const stringMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.7
        });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.y = -1.5;
        group.add(string);

        group.position.set(x, y, z);
        return group;
    }

    createBanners() {
        // Create triangular banner flags
        const colors = [0xff6b9d, 0xffe66d, 0x4ecdc4, 0xc44569, 0x574b90];
        const bannerCount = 15;
        const radius = 8;

        for (let i = 0; i < bannerCount; i++) {
            const angle = (Math.PI * i) / bannerCount;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius - 5;
            const color = colors[i % colors.length];

            // Triangle flag
            const flagShape = new THREE.Shape();
            flagShape.moveTo(0, 0);
            flagShape.lineTo(0.4, -0.6);
            flagShape.lineTo(-0.4, -0.6);
            flagShape.lineTo(0, 0);

            const flagGeometry = new THREE.ShapeGeometry(flagShape);
            const flagMaterial = new THREE.MeshStandardMaterial({
                color: color,
                side: THREE.DoubleSide,
                roughness: 0.6
            });
            const flag = new THREE.Mesh(flagGeometry, flagMaterial);
            flag.position.set(x, 6.5, z);
            flag.rotation.y = -angle;
            this.scene.add(flag);
        }

        // Banner string
        const stringCurve = new THREE.EllipseCurve(
            0, 0,
            radius, radius,
            0, Math.PI,
            false,
            0
        );
        const stringPoints = stringCurve.getPoints(50);
        const stringGeometry = new THREE.BufferGeometry().setFromPoints(
            stringPoints.map(p => new THREE.Vector3(p.x, 6.8, p.y - 5))
        );
        const stringMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const stringLine = new THREE.Line(stringGeometry, stringMaterial);
        this.scene.add(stringLine);
    }

    createFloatingConfetti() {
        const confettiCount = 100;
        const confettiColors = [0xff6b9d, 0xffe66d, 0x4ecdc4, 0xc44569, 0x574b90, 0xff6348];
        
        this.confettiParticles = [];

        for (let i = 0; i < confettiCount; i++) {
            const geometry = new THREE.PlaneGeometry(0.1, 0.15);
            const material = new THREE.MeshStandardMaterial({
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                side: THREE.DoubleSide,
                roughness: 0.5,
                metalness: 0.3
            });
            const confetti = new THREE.Mesh(geometry, material);
            
            confetti.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 8 + 1,
                (Math.random() - 0.5) * 20
            );
            
            confetti.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            this.confettiParticles.push({
                mesh: confetti,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.1,
                    y: (Math.random() - 0.5) * 0.1,
                    z: (Math.random() - 0.5) * 0.1
                },
                fallSpeed: Math.random() * 0.02 + 0.01,
                swaySpeed: Math.random() * 0.5 + 0.5,
                swayAmount: Math.random() * 0.02 + 0.01
            });

            this.scene.add(confetti);
        }
    }

    createSpotlights() {
        // Colored spotlights for dramatic effect
        const spotlightColors = [0xff6b9d, 0x4ecdc4, 0xffe66d];
        const positions = [
            { x: -5, z: 5 },
            { x: 5, z: 5 },
            { x: 0, z: 6 }
        ];

        positions.forEach((pos, index) => {
            const spotLight = new THREE.SpotLight(
                spotlightColors[index],
                0.3,
                15,
                Math.PI / 6,
                0.5
            );
            spotLight.position.set(pos.x, 7, pos.z);
            spotLight.target.position.set(0, 0, 0);
            spotLight.castShadow = false;
            this.scene.add(spotLight);
            this.scene.add(spotLight.target);
        });
    }

    createWallStars() {
        // Add decorative stars on the back wall
        for (let i = 0; i < 20; i++) {
            const star = this.createStar();
            const angle = (Math.random() * Math.PI) - Math.PI / 2;
            const radius = 8 + Math.random() * 3;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius - 5;
            const y = Math.random() * 5 + 2;

            star.position.set(x, y, z);
            star.rotation.z = Math.random() * Math.PI * 2;
            star.scale.setScalar(0.1 + Math.random() * 0.15);
            this.scene.add(star);
        }
    }

    createStar() {
        const starShape = new THREE.Shape();
        const outerRadius = 1;
        const innerRadius = 0.4;
        const points = 5;

        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * i) / points;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                starShape.moveTo(x, y);
            } else {
                starShape.lineTo(x, y);
            }
        }
        starShape.closePath();

        const geometry = new THREE.ShapeGeometry(starShape);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffe66d,
            emissive: 0xffe66d,
            emissiveIntensity: 0.5,
            side: THREE.DoubleSide
        });
        
        return new THREE.Mesh(geometry, material);
    }

    update(delta) {
        this.time += delta;

        // Animate balloons - gentle floating
        this.balloons.forEach(balloon => {
            balloon.mesh.position.y = balloon.baseHeight + 
                Math.sin(this.time * balloon.speed + balloon.phase) * 0.2;
            balloon.mesh.rotation.y += delta * 0.3;
        });

        // Animate confetti - falling and rotating
        this.confettiParticles.forEach(confetti => {
            confetti.mesh.rotation.x += confetti.rotationSpeed.x;
            confetti.mesh.rotation.y += confetti.rotationSpeed.y;
            confetti.mesh.rotation.z += confetti.rotationSpeed.z;

            // Sway motion
            confetti.mesh.position.x += Math.sin(this.time * confetti.swaySpeed) * confetti.swayAmount;

            // Slow fall
            confetti.mesh.position.y -= confetti.fallSpeed;

            // Reset position when it falls too low
            if (confetti.mesh.position.y < 0.5) {
                confetti.mesh.position.y = 8 + Math.random() * 2;
                confetti.mesh.position.x = (Math.random() - 0.5) * 20;
                confetti.mesh.position.z = (Math.random() - 0.5) * 20;
            }
        });
    }
}
