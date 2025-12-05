/**
 * Position Calculator Service
 * Calculates delivery position based on time, distance, and delivery method
 */

class PositionCalculator {
    /**
     * Delivery method speeds (km/h)
     */
    static SPEEDS = {
        road: 60,      // 60 km/h
        flight: 500,   // 500 km/h
        sea: 40        // 40 km/h
    };

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lon1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lon2 - Longitude of point 2
     * @returns {number} Distance in kilometers
     */
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    /**
     * Convert degrees to radians
     */
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     */
    static toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     * Calculate current position based on time elapsed
     * @param {Object} delivery - Delivery object with start/end coordinates and times
     * @returns {Object} Current position with latitude, longitude, and progress percentage
     */
    static calculateCurrentPosition(delivery) {
        const now = new Date();
        const startTime = new Date(delivery.start_time);
        const endTime = new Date(delivery.end_time);

        // If delivery hasn't started yet
        if (now < startTime) {
            return {
                latitude: delivery.sender_latitude || 0,
                longitude: delivery.sender_longitude || 0,
                progress: 0,
                status: 'pending',
                estimated_time_remaining: this.formatTimeRemaining(endTime - startTime)
            };
        }

        // If delivery is complete
        if (now >= endTime) {
            return {
                latitude: delivery.receiver_latitude || 0,
                longitude: delivery.receiver_longitude || 0,
                progress: 100,
                status: 'delivered',
                estimated_time_remaining: '0 minutes'
            };
        }

        // Calculate progress (0 to 1)
        const totalDuration = endTime - startTime;
        const elapsedDuration = now - startTime;
        const progress = elapsedDuration / totalDuration;

        // Calculate intermediate position
        const startLat = parseFloat(delivery.sender_latitude || 0);
        const startLon = parseFloat(delivery.sender_longitude || 0);
        const endLat = parseFloat(delivery.receiver_latitude || 0);
        const endLon = parseFloat(delivery.receiver_longitude || 0);

        const currentLat = startLat + (endLat - startLat) * progress;
        const currentLon = startLon + (endLon - startLon) * progress;

        // Calculate total distance
        const totalDistance = this.calculateDistance(startLat, startLon, endLat, endLon);
        const remainingDistance = totalDistance * (1 - progress);

        // Determine status based on progress
        let status = 'in_transit';
        if (progress > 0.9) {
            status = 'out_for_delivery';
        } else if (progress > 0.75) {
            status = 'arrived';
        }

        // Calculate estimated time remaining
        const timeRemaining = endTime - now;

        return {
            latitude: currentLat,
            longitude: currentLon,
            progress: Math.round(progress * 100),
            status,
            total_distance: totalDistance.toFixed(2),
            remaining_distance: remainingDistance.toFixed(2),
            estimated_time_remaining: this.formatTimeRemaining(timeRemaining)
        };
    }

    /**
     * Calculate estimated arrival time based on distance and speed
     * @param {number} distance - Distance in kilometers
     * @param {string} method - Delivery method (road, flight, sea)
     * @returns {Date} Estimated arrival time
     */
    static calculateETA(distance, method, startTime) {
        const speed = this.SPEEDS[method] || this.SPEEDS.road;
        const hoursNeeded = distance / speed;
        const millisecondsNeeded = hoursNeeded * 60 * 60 * 1000;

        const eta = new Date(startTime.getTime() + millisecondsNeeded);
        return eta;
    }

    /**
     * Format time remaining in human-readable format
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time string
     */
    static formatTimeRemaining(milliseconds) {
        const totalMinutes = Math.floor(milliseconds / 60000);

        if (totalMinutes < 60) {
            return `${totalMinutes} minutes`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours < 24) {
            return `${hours}h ${minutes}m`;
        }

        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    }

    /**
     * Generate location address from coordinates (simple placeholder)
     * In production, you'd use Google Geocoding API
     */
    static generateLocationAddress(latitude, longitude) {
        return `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
    }

    /**
     * Check if delivery should be automatically updated
     * @param {Object} delivery - Delivery object
     * @returns {boolean} True if delivery should be updated
     */
    static shouldUpdateDelivery(delivery) {
        const now = new Date();
        const startTime = new Date(delivery.start_time);
        const endTime = new Date(delivery.end_time);

        // Only update if delivery is between start and end time
        // AND status is not already 'delivered' or 'cancelled'
        return now >= startTime &&
            now <= endTime &&
            delivery.delivery_status !== 'delivered' &&
            delivery.delivery_status !== 'cancelled';
    }
}

module.exports = PositionCalculator;