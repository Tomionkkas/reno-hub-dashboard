
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Augment the window interface to include gtag
declare global {
    interface Window {
        gtag: (
            command: string,
            targetId: string,
            config?: Record<string, any>
        ) => void;
    }
}

export const GoogleAdsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if window.gtag exists (it should be loaded from index.html)
        if (typeof window.gtag !== "function") {
            console.warn("Google Ads: window.gtag not found.");
            return;
        }

        // 1. Always update the config with the current page path (Critical for SPA)
        // debug_mode: true forces Google to log to console even on localhost
        window.gtag("config", "AW-17946979757", {
            page_path: location.pathname + location.search,
            debug_mode: true,
        });
        console.log("Google Ads: Page View Triggered for", location.pathname);

        // 2. Trigger Conversion Event ONLY on Home Page View ('/')
        if (location.pathname === "/") {
            // Use a small timeout to ensure the config update processes first
            setTimeout(() => {
                console.log("Google Ads: Triggering Home Page Conversion Event");
                window.gtag("event", "conversion", {
                    send_to: "AW-17946979757/zTg-CI-C3vYbEK3b50lC",
                    value: 1.0,
                    currency: "PLN",
                    debug_mode: true, // Force debug for event too
                });
            }, 1000); // Increased timeout to 1s to be safe
        }
    }, [location]);

    return null;
};
