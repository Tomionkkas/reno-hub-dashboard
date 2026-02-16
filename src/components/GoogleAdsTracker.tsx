
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

        const pagePath = location.pathname + location.search;

        // Update GA4 and Google Ads config on every route change (critical for SPA)
        window.gtag("config", "G-2HYP54YFFP", { page_path: pagePath });
        window.gtag("config", "AW-17946979757", { page_path: pagePath });
        console.log("Analytics: Page View Triggered for", location.pathname);

        // 2. Trigger Conversion Event ONLY on Home Page View ('/')
        if (location.pathname === "/") {
            setTimeout(() => {
                console.log("Google Ads: Triggering Home Page Conversion Event");
                window.gtag("event", "conversion", {
                    send_to: "AW-17946979757/zTg-CI-C3vYbEK3b5O1C",
                    value: 1.0,
                    currency: "PLN",
                });
            }, 500);
        }
    }, [location]);

    return null;
};
