// Initialize audio components
let synth = null;
let isPlaying = false;
let currentFrequency = 440;

// Get DOM elements
const canvas = document.getElementById('colorSpace');
const ctx = canvas.getContext('2d');
const frequencyDisplay = document.getElementById('frequencyDisplay');

// Set up canvas and create color gradient
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create full spectrum gradient including black and white
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
    );
    
    // Center (white) to outer edge (creating a circular spectrum)
    gradient.addColorStop(0, '#FFFFFF');    // White
    gradient.addColorStop(0.2, '#FF0000');  // Red
    gradient.addColorStop(0.3, '#FF7F00');  // Orange
    gradient.addColorStop(0.4, '#FFFF00');  // Yellow
    gradient.addColorStop(0.5, '#00FF00');  // Green
    gradient.addColorStop(0.6, '#0000FF');  // Blue
    gradient.addColorStop(0.7, '#4B0082');  // Indigo
    gradient.addColorStop(0.8, '#9400D3');  // Violet
    gradient.addColorStop(1, '#000000');    // Black
    
    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initialize audio
async function initAudio() {
    await Tone.start();
    synth = new Tone.Oscillator({
        type: 'sine',
        frequency: currentFrequency,
        volume: -10
    }).toDestination();
}

// Get color at cursor position
function getColorAtPosition(x, y) {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2]
    };
}

// Update frequency based on cursor position
function updateFrequency(x, y) {
    const color = getColorAtPosition(x, y);
    const frequency = rgbToFrequency(color.r, color.g, color.b);
    currentFrequency = frequency;
    frequencyDisplay.textContent = frequency;
    
    if (isPlaying && synth) {
        synth.frequency.value = frequency;
    }
}

// Convert RGB to frequency (simplified mapping)
function rgbToFrequency(r, g, b) {
    // Calculate perceived brightness (weighted RGB values)
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    
    // Map brightness to frequency range (0Hz - 20000Hz for full human hearing range)
    const frequency = brightness * 20000;
    return Math.round(frequency);
}

// Event Listeners
window.addEventListener('load', () => {
    setupCanvas();
    initAudio();
});

window.addEventListener('resize', setupCanvas);

canvas.addEventListener('mousemove', (e) => {
    updateFrequency(e.clientX, e.clientY);
});

document.addEventListener('keydown', async (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        
        if (!synth) {
            await initAudio();
        }
        
        if (isPlaying) {
            synth.stop();
            isPlaying = false;
        } else {
            synth.frequency.value = currentFrequency;
            synth.start();
            isPlaying = true;
        }
    }
});
