export const colorUtils = {
    // Convert Hex to HSL
    hexToHSL(hex) {
        let r = parseInt(hex.substring(1, 3), 16) / 255;
        let g = parseInt(hex.substring(3, 5), 16) / 255;
        let b = parseInt(hex.substring(5, 7), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h, s: s * 100, l: l * 100 };
    },

    // Convert HSL to Hex
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r, g, b;

        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    },

    // Convert Hex to RGB
    hexToRGB(hex) {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    },

    // Adjust color brightness (lighter/darker)
    adjustColor(hex, lightnessChange) {
        let hsl = this.hexToHSL(hex);
        
        if (hsl.l === 100 && lightnessChange > 0) {
            hsl.l = Math.max(95, hsl.l - lightnessChange); // Reduce slightly instead of increasing
        } else if (hsl.l === 0 && lightnessChange < 0) {
            hsl.l = Math.min(5, hsl.l - lightnessChange); // Increase slightly instead of decreasing
        } else {
            hsl.l = Math.min(100, Math.max(0, hsl.l + lightnessChange)); // Regular case
        }
    
        return this.hslToHex(hsl.h, hsl.s, hsl.l);
    },

    // Determine optimal text color based on background brightness
    getContrastTextColor(bgHex) {
        let { l } = this.hexToHSL(bgHex);
        return l < 50 ? '#FFFFFF' : '#000000'; // Dark background → White text, Light background → Black text
    },

    isDark(bgHex) {
        let { l } = this.hexToHSL(bgHex);
        return l < 50 ? true : false;
    },

    // Apply dynamic colors to CSS variables
    applyDynamicColors() {
        const root = document.documentElement;
        // Get colors from CSS variables
        const appAccent = getComputedStyle(root).getPropertyValue('--app-accent').trim();
        const appBackground = getComputedStyle(root).getPropertyValue('--app-background').trim();
        if(appAccent && appBackground){
            // Generate accent hover and active colors
            console.log("this.adjustColor(appBackground, 10)",this.adjustColor(appBackground, -10))
            root.style.setProperty("--app-accent", appAccent);
            root.style.setProperty("--app-accent-hover", this.adjustColor(appAccent, 10));
            root.style.setProperty("--app-accent-active", this.adjustColor(appAccent, -10));
            root.style.setProperty("--accent", this.getContrastTextColor(appBackground));
            root.style.setProperty("--accent-rgb", this.hexToRGB(this.getContrastTextColor(appBackground)));
            root.style.setProperty("--app-background-active", this.adjustColor(appBackground, 10));
            document.body.style.backgroundColor = "var(--app-background)";
            document.body.style.color = "var(--accent)";
        }
    }
};
