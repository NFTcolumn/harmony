// Initialize audio components
let synth = null;
let isPlaying = false;
let currentFrequency = 440;

// Get DOM elements
const canvas = document.getElementById('colorSpace');
const ctx = canvas.getContext('2d');
const frequencyDisplay = document.getElementById('frequencyDisplay');

// Set up canvas and create color picker
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create main color area (saturation x value)
    const mainGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    
    // Add colors for the rainbow spectrum
    mainGradient.addColorStop(0, '#ff0000');   // Red
    mainGradient.addColorStop(0.17, '#ff8000'); // Orange
    mainGradient.addColorStop(0.33, '#ffff00'); // Yellow
    mainGradient.addColorStop(0.5, '#00ff00');  // Green
    mainGradient.addColorStop(0.67, '#0000ff'); // Blue
    mainGradient.addColorStop(0.83, '#4b0082'); // Indigo
    mainGradient.addColorStop(1, '#9400d3');    // Violet
    
    // Fill the canvas with the color gradient
    ctx.fillStyle = mainGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add white to black vertical gradient overlay
    const valueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    valueGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    valueGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    valueGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    valueGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    ctx.fillStyle = valueGradient;
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

// Convert RGB to frequency
function rgbToFrequency(r, g, b) {
    // Calculate relative position in the color space
    const x = r / 255; // Horizontal position (hue/saturation)
    const y = b / 255; // Vertical position (brightness)
    
    // Map x and y coordinates to frequency
    // x determines base frequency range (0Hz - 15000Hz)
    // y determines final frequency (0Hz - 20000Hz)
    const baseFreq = x * 15000;
    const finalFreq = y * 20000;
    
    // Blend between base frequency and final frequency
    const frequency = Math.min(20000, Math.max(0, (baseFreq + finalFreq) / 2));
    
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
