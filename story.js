export class Story {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.currentSlide = 0;
        this.slides = [
        "26 سنة من الفرح والضحك",
            "اليوم يوم مميز لشخص استثنائي",
            "شخص ينير كل مكان يدخله",
            "زينب، هذا من أجلك ✨"
        ];
        this.overlay = document.getElementById('story-overlay');
        this.textElement = document.getElementById('story-text');
    }

    start() {
        this.showSlide(0);
    }

    showSlide(index) {
        if (index >= this.slides.length) {
            // Story complete - hide overlay and callback
            this.overlay.classList.remove('active');
            setTimeout(() => {
                this.onComplete();
            }, 500);
            return;
        }

        const text = this.slides[index];
        this.textElement.textContent = '';
        this.textElement.classList.remove('fade-out');
        this.textElement.classList.add('fade-in');

        // Typewriter effect
        this.typeWriter(text, 0, () => {
            // Wait 2 seconds before fading out
            setTimeout(() => {
                this.textElement.classList.remove('fade-in');
                this.textElement.classList.add('fade-out');
                
                // Wait for fade out, then show next slide
                setTimeout(() => {
                    this.showSlide(index + 1);
                }, 1000);
            }, 2000);
        });
    }

    typeWriter(text, charIndex, callback) {
        if (charIndex < text.length) {
            this.textElement.textContent += text.charAt(charIndex);
            setTimeout(() => {
                this.typeWriter(text, charIndex + 1, callback);
            }, 50); // Typing speed
        } else {
            callback();
        }
    }
}
