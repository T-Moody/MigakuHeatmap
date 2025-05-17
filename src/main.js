import {
    LEGENDS_SELECTOR,
    DIVIDERS_SELECTOR,
    TOOLTIP_SELECTOR
} from './constants.js';
import { getElements, removeElements } from './services/domService.js';
import { log, warn } from './services/loggerService.js';
import { getHeatmapTiles, applyGradientToHeatmapTiles } from './services/heatmapService.js';
import { extractTooltipData } from './services/tooltipService.js';

// --- Entry Point ---
main();

function main() {
    logDomState();
    setupObserver();
    updateHeatmap();
}

function logDomState() {
    if (document.readyState === "loading") {
        log("DOM fully loaded. Setting up MutationObserver...");
    } else {
        log("DOM already loaded. Setting up MutationObserver...");
    }
}

function setupObserver() {
    const observer = new MutationObserver(updateHeatmap);
    observer.observe(document.body, { childList: true, subtree: true });
    log("MutationObserver set up.");
}

function updateHeatmap() {
    removeElements([LEGENDS_SELECTOR, DIVIDERS_SELECTOR]);
    const tooltips = getElements(TOOLTIP_SELECTOR);
    if (!tooltips.length) {
        warn("No tooltips found. Waiting for DOM updates...");
        return;
    }
    const { reviewCounts, tooltipData } = extractTooltipData(tooltips);
    if (!reviewCounts.length) {
        warn("No review counts extracted.");
        return;
    }
    const maxReviewCount = Math.max(...reviewCounts);
    log(`Maximum review count determined: ${maxReviewCount}`);
    const heatmapTiles = getHeatmapTiles();
    if (!heatmapTiles.length) {
        warn("No heatmap tiles found.");
        return;
    }
    applyGradientToHeatmapTiles(heatmapTiles, tooltipData, maxReviewCount);
}