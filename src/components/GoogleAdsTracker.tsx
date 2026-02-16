
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

        // Trigger Conversion Event on Home Page View ('/')
        if (location.pathname === "/") {
            console.log("Google Ads: Triggering Home Page Conversion Event");
            window.gtag("event", "conversion", {
                send_to: "AW-17946979757/zTg-CI-C3vYbEK3b50lC",
                value: 1.0,
                currency: "PLN",
            });
        }
    }, [location.pathname]);

    return null;
};
