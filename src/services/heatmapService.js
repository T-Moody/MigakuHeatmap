import {
    HEATMAP_TILE_STARTED_SELECTOR,
    HEATMAP_TILE_COMPLETED_SELECTOR,
    HEATMAP_COLOR,
    MIN_OPACITY
} from './../constants.js';
import { getElements } from './domService.js';
import { log, warn } from './loggerService.js';

export function getHeatmapTiles() {
    return [
        ...getElements(HEATMAP_TILE_STARTED_SELECTOR),
        ...getElements(HEATMAP_TILE_COMPLETED_SELECTOR)
    ];
}

export function applyGradientToHeatmapTiles(tiles, tooltipData, maxReviewCount) {
    tiles.forEach(tile => {
        const tooltipId = tile.getAttribute("aria-controls");
        const reviewCount = tooltipData[tooltipId];

        if (reviewCount === undefined) {
            warn(`No review count found for heatmap tile linked to tooltip ID: ${tooltipId}`);
            return;
        }

        const opacity = calculateOpacity(reviewCount, maxReviewCount);
        setTileColor(tile, opacity);
        logTileUpdate(tooltipId, reviewCount, opacity);
    });

    log("Gradient application completed.");
}

function calculateOpacity(reviewCount, maxReviewCount) {
    return Math.max(MIN_OPACITY, reviewCount / maxReviewCount);
}

function setTileColor(tile, opacity) {
    tile.style.setProperty("background-color", `rgba(${HEATMAP_COLOR}, ${opacity})`, "important");
}

function logTileUpdate(tooltipId, reviewCount, opacity) {
    log(`Tile linked to tooltip ID: ${tooltipId}, review count: ${reviewCount}, opacity: ${opacity}`);
}