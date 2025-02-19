// Frequency mapping data
const COLOR_FREQUENCIES = {
    // THz to Hz conversion (we'll use scaled down values for audible range)
    red: {
        thz: { min: 430, max: 480 },
        hz: { min: 440, max: 480 }  // Scaled for audible range
    },
    orange: {
        thz: { min: 480, max: 510 },
        hz: { min: 480, max: 510 }
    },
    yellow: {
        thz: { min: 510, max: 530 },
        hz: { min: 510, max: 530 }
    },
    green: {
        thz: { min: 530, max: 580 },
        hz: { min: 530, max: 580 }
    },
    blue: {
        thz: { min: 580, max: 620 },
        hz: { min: 580, max: 620 }
    },
    indigo: {
        thz: { min: 620, max: 670 },
        hz: { min: 620, max: 670 }
    },
    violet: {
        thz: { min: 670, max: 750 },
        hz: { min: 670, max: 700 }  // Capped at 700Hz for better audibility
    }
};

const ELEMENT_FREQUENCIES = {
    fire: 440,   // A4 note
    water: 528,  // Healing frequency
    earth: 396,  // Grounding frequency
    air: 741,    // Clarity frequency
    ether: 852   // Spiritual frequency
};

// Convert RGB color to wavelength (approximate)
function rgbToWavelength(r, g, b) {
    // Simple weighted average for demo purposes
    // In reality, this would need a more sophisticated spectral analysis
    const normalized = {
        r: r / 255,
        g: g / 255,
        b: b / 255
    };
    
    // Calculate dominant color and map to frequency range
    const max = Math.max(normalized.r, normalized.g, normalized.b);
    let frequency;
    
    if (max === normalized.r) {
        frequency = mapRange(normalized.r, 0, 1, COLOR_FREQUENCIES.red.hz.min, COLOR_FREQUENCIES.red.hz.max);
    } else if (max === normalized.g) {
        frequency = mapRange(normalized.g, 0, 1, COLOR_FREQUENCIES.green.hz.min, COLOR_FREQUENCIES.green.hz.max);
    } else {
        frequency = mapRange(normalized.b, 0, 1, COLOR_FREQUENCIES.blue.hz.min, COLOR_FREQUENCIES.blue.hz.max);
    }
    
    return Math.round(frequency);
}

// Helper function to map a value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Convert hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Get frequency from hex color
function getFrequencyFromColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return 440; // Default to A4 if conversion fails
    return rgbToWavelength(rgb.r, rgb.g, rgb.b);
}

// Export for use in script.js
window.FrequencyUtils = {
    COLOR_FREQUENCIES,
    ELEMENT_FREQUENCIES,
    getFrequencyFromColor
};
