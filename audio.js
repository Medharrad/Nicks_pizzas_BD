export class Audio {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isMonitoring = false;
        this.blowThreshold = 0.4; // Medium sensitivity
        this.blowCallback = null;
        this.lastBlowTime = 0;
        this.blowCooldown = 1000; // 1 second between blows
        this.musicElement = null;
    }

    requestMicrophonePermission(callback) {
        const micOverlay = document.getElementById('mic-overlay');
        const enableBtn = document.getElementById('enable-mic');
        const skipBtn = document.getElementById('skip-mic');

        micOverlay.classList.add('active');

        enableBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.setupMicrophone(stream);
                micOverlay.classList.remove('active');
                callback(true);
            } catch (error) {
                console.error('Microphone access denied:', error);
                alert('Microphone access denied. You can still click on candles to blow them out!');
                micOverlay.classList.remove('active');
                callback(false);
            }
        });

        skipBtn.addEventListener('click', () => {
            micOverlay.classList.remove('active');
            callback(false);
        });
    }

    setupMicrophone(stream) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.microphone.connect(this.analyser);
        
        this.isMonitoring = true;
        this.monitorVolume();
    }

    monitorVolume() {
        if (!this.isMonitoring) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / this.dataArray.length / 255; // Normalize to 0-1
        
        // Check for blow
        const now = Date.now();
        if (average > this.blowThreshold && now - this.lastBlowTime > this.blowCooldown) {
            this.lastBlowTime = now;
            if (this.blowCallback) {
                this.blowCallback();
            }
        }
        
        requestAnimationFrame(() => this.monitorVolume());
    }

    getCurrentVolume() {
        if (!this.analyser || !this.dataArray) return 0;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        return sum / this.dataArray.length / 255;
    }

    onBlow(callback) {
        this.blowCallback = callback;
    }

    playMusic() {
        // Create audio element for birthday music
        this.musicElement = document.createElement('audio');
        
        // Use the uploaded happy birthday music file
        this.musicElement.src = '/happy_birthday.mp3';
        
        this.musicElement.loop = true;
        this.musicElement.volume = 0.6;
        
        // Handle autoplay restrictions
        const playPromise = this.musicElement.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented. User interaction required.');
                // Add click listener to play on first interaction
                document.addEventListener('click', () => {
                    this.musicElement.play();
                }, { once: true });
            });
        }
    }

    generatePlaceholderMusic() {
        // Create a simple pleasant melody using Web Audio API
        // This is just a placeholder - replace with actual MP3 file
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Happy Birthday melody notes (in Hz)
        const melody = [
            { freq: 262, duration: 0.4 }, // C
            { freq: 262, duration: 0.4 }, // C
            { freq: 294, duration: 0.8 }, // D
            { freq: 262, duration: 0.8 }, // C
            { freq: 349, duration: 0.8 }, // F
            { freq: 330, duration: 1.6 }, // E
            { freq: 262, duration: 0.4 }, // C
            { freq: 262, duration: 0.4 }, // C
            { freq: 294, duration: 0.8 }, // D
            { freq: 262, duration: 0.8 }, // C
            { freq: 392, duration: 0.8 }, // G
            { freq: 349, duration: 1.6 }  // F
        ];

        let time = this.audioContext.currentTime;
        
        const playMelody = () => {
            melody.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = note.freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, time);
                gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
                
                oscillator.start(time);
                oscillator.stop(time + note.duration);
                
                time += note.duration;
            });
            
            // Loop the melody
            setTimeout(playMelody, melody.reduce((sum, note) => sum + note.duration, 0) * 1000 + 1000);
        };
        
        playMelody();
    }

    stop() {
        this.isMonitoring = false;
        if (this.musicElement) {
            this.musicElement.pause();
        }
        if (this.microphone) {
            this.microphone.disconnect();
        }
    }
}
