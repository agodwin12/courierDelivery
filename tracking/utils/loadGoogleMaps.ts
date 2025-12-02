// utils/loadGoogleMaps.ts

let isLoading = false;
let isLoaded = false;

export const loadGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // If already loaded, resolve immediately
        if (isLoaded && window.google && window.google.maps) {
            console.log('Google Maps already loaded');
            resolve();
            return;
        }

        // If currently loading, wait for it
        if (isLoading) {
            console.log('Google Maps is loading...');
            const checkInterval = setInterval(() => {
                if (isLoaded && window.google && window.google.maps) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
            console.log('Google Maps script exists, waiting for load...');
            existingScript.addEventListener('load', () => {
                isLoaded = true;
                resolve();
            });
            return;
        }

        // Start loading
        isLoading = true;
        console.log('Loading Google Maps script...');

        // Create callback function name
        const callbackName = 'initGoogleMaps' + Date.now();

        // Set up callback
        (window as any)[callbackName] = () => {
            console.log('Google Maps loaded successfully!');
            isLoaded = true;
            isLoading = false;
            delete (window as any)[callbackName];
            resolve();
        };

        // Create and append script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBn88TP5X-xaRCYo5gYxvGnVy_0WYotZWo&callback=${callbackName}`;
        script.async = true;
        script.defer = true;

        script.onerror = (error) => {
            console.error('Failed to load Google Maps:', error);
            isLoading = false;
            delete (window as any)[callbackName];
            reject(new Error('Failed to load Google Maps'));
        };

        document.head.appendChild(script);
    });
};

// Extend window type
declare global {
    interface Window {
        google: any;
    }
}