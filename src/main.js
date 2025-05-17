
// Main entry point
if (document.readyState === "loading") {
    console.log("[MIGAKU_STATS] DOM fully loaded. Setting up MutationObserver...");

    // Initialize the observer and process tooltips
    setupObserver();
    processTooltips();
} else {
    console.log("[MIGAKU_STATS] DOM already loaded loaded. Setting up MutationObserver...");

    // Initialize the observer and process tooltips
    setupObserver();
    processTooltips();
}

function removeLegendsAndDividers() {
    const legends = document.querySelectorAll('.Statistic__legends');
    legends.forEach(el => el.remove());

    const dividers = document.querySelectorAll('.Statistic__card__divider');
    dividers.forEach(el => el.remove());
}

/**
 * Sets up a MutationObserver to watch for changes in the DOM.
 */
function setupObserver() {
    const observer = new MutationObserver(() => {
        processTooltips();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[MIGAKU_STATS] MutationObserver set up.");
}

/**
 * Processes all tooltips in the DOM.
 */
function processTooltips() {
    removeLegendsAndDividers();

    const tooltips = getTooltips();
    if (tooltips.length === 0) {
        console.warn("[MIGAKU_STATS] No tooltips found. Waiting for DOM updates...");
        return;
    }

    const { reviewCounts, tooltipData } = extractTooltipData(tooltips);
    const maxReviewCount = calculateMaxReviewCount(reviewCounts);

    const heatmapTiles = getHeatmapTiles();
    if (heatmapTiles.length === 0) {
        console.warn("[MIGAKU_STATS] No heatmap tiles found.");
        return;
    }

    applyGradientToHeatmapTiles(heatmapTiles, tooltipData, maxReviewCount);
}

/**
 * Retrieves all tooltips from the DOM.
 * @returns {NodeListOf<Element>} A list of tooltip elements.
 */
function getTooltips() {
    const tooltips = document.querySelectorAll(".Statistic__tooltip");
    console.log(`[MIGAKU_STATS] Found ${tooltips.length} tooltips.`);
    return tooltips;
}

/**
 * Extracts review counts and tooltip data from the tooltips.
 * @param {NodeListOf<Element>} tooltips - The list of tooltip elements.
 * @returns {Object} An object containing reviewCounts and tooltipData.
 */
function extractTooltipData(tooltips) {
    const reviewCounts = [];
    const tooltipData = {};

    tooltips.forEach((tooltip) => {
        const tooltipId = tooltip.parentElement.id;
        const smallCaption = tooltip.querySelector(".UiTypo.UiTypo__smallCaption");

        if (!smallCaption) {
            console.warn(`[MIGAKU_STATS] No small caption found for tooltip with ID: ${tooltipId}`);
            return;
        }

        const reviewText = smallCaption.innerText.trim();
        console.log(`[MIGAKU_STATS] Processing tooltip with ID: ${tooltipId}, text: "${reviewText}"`);

        const match = reviewText.match(/(\d+)\s+reviews/);
        if (match) {
            const reviewCount = parseInt(match[1], 10);
            console.log(`[MIGAKU_STATS] Extracted review count: ${reviewCount}`);
            reviewCounts.push(reviewCount);
            tooltipData[tooltipId] = reviewCount;
        } else {
            console.warn(`[MIGAKU_STATS] No review count found for tooltip with ID: ${tooltipId}`);
        }
    });

    return { reviewCounts, tooltipData };
}

/**
 * Calculates the maximum review count.
 * @param {number[]} reviewCounts - An array of review counts.
 * @returns {number} The maximum review count.
 */
function calculateMaxReviewCount(reviewCounts) {
    const maxReviewCount = Math.max(...reviewCounts);
    console.log(`[MIGAKU_STATS] Maximum review count determined: ${maxReviewCount}`);
    return maxReviewCount;
}

/**
 * Retrieves all heatmap tiles from the DOM.
 * @returns {Element[]} An array of heatmap tile elements.
 */
function getHeatmapTiles() {
    const heatmapTilesStarted = document.querySelectorAll(".Statistic__heatmap__tile.--started");
    const heatmapTilesCompleted = document.querySelectorAll(".Statistic__heatmap__tile.--completed");
    const heatmapTiles = [...heatmapTilesStarted, ...heatmapTilesCompleted];
    console.log(`[MIGAKU_STATS] Found ${heatmapTiles.length} heatmap tiles.`);
    return heatmapTiles;
}

/**
 * Applies a gradient background color to heatmap tiles based on review counts.
 * @param {Element[]} heatmapTiles - The list of heatmap tile elements.
 * @param {Object} tooltipData - A mapping of tooltip IDs to review counts.
 * @param {number} maxReviewCount - The maximum review count.
 */
function applyGradientToHeatmapTiles(heatmapTiles, tooltipData, maxReviewCount) {
    heatmapTiles.forEach((tile) => {
        const tooltipId = tile.getAttribute("aria-controls");
        const reviewCount = tooltipData[tooltipId];

        if (reviewCount !== undefined) {
            const opacity = Math.max(0.05, reviewCount / maxReviewCount);
            console.log(`[MIGAKU_STATS] Tile linked to tooltip ID: ${tooltipId}, review count: ${reviewCount}, opacity: ${opacity}`);
            tile.style.setProperty("background-color", `rgba(1, 199, 164, ${opacity})`, "important");
        } else {
            console.warn(`[MIGAKU_STATS] No review count found for heatmap tile linked to tooltip ID: ${tooltipId}`);
        }
    });

    console.log("[MIGAKU_STATS] Gradient application completed.");
}