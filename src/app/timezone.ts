// utils/timezone.ts

import tzlookup from "tz-lookup";

export default class TimeZoneUtils {
    static async getTimezone(): Promise<string | null> {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const tz = tzlookup(latitude, longitude);
                        resolve(tz);
                    },
                    (error) => {
                        console.error('Error getting geolocation:', error);
                        reject(error);
                    }
                );
            } else {
                console.error('Geolocation is not supported');
                reject(new Error('Geolocation is not supported'));
            }
        });
    }
}
