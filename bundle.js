
// ==UserScript==
// @name         Migaku Custom Heatmap
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Custom stats for Migaku Memory.
// @author       tmoody
// @license      GPL-3.0
// @match        https://study.migaku.com/statistic
// @run-at       document-idle
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/T-Moody/MigakuHeatmap/release/bundle.js
// @downloadURL  https://raw.githubusercontent.com/T-Moody/MigakuHeatmap/release/bundle.js
// ==/UserScript==

(function () {
    'use strict';

    const LEGENDS_SELECTOR = '.Statistic__legends';
    const DIVIDERS_SELECTOR = '.Statistic__card__divider';
    const TOOLTIP_SELECTOR = '.Statistic__tooltip';
    const TOOLTIP_CAPTION_SELECTOR = '.UiTypo.UiTypo__smallCaption';
    const HEATMAP_TILE_STARTED_SELECTOR = '.Statistic__heatmap__tile.--started';
    const HEATMAP_TILE_COMPLETED_SELECTOR = '.Statistic__heatmap__tile.--completed';
    const HEATMAP_COLOR = '1, 199, 164'; // RGB for rgba()
    const MIN_OPACITY = 0.05;

    function getElements(selector) {
      return Array.from(document.querySelectorAll(selector));
    }
    function removeElements(selectors) {
      selectors.forEach(selector => {
        getElements(selector).forEach(el => el.remove());
      });
    }

    function log(msg) {
      console.log(`[MIGAKU_STATS] ${msg}`);
    }
    function warn(msg) {
      console.warn(`[MIGAKU_STATS] ${msg}`);
    }

    function getHeatmapTiles() {
      return [...getElements(HEATMAP_TILE_STARTED_SELECTOR), ...getElements(HEATMAP_TILE_COMPLETED_SELECTOR)];
    }
    function applyGradientToHeatmapTiles(tiles, tooltipData, maxReviewCount) {
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

    const REVIEW_COUNT_REGEX = /(\d+)\s+reviews/;
    function extractTooltipData(tooltips) {
      const reviewCounts = [];
      const tooltipData = {};
      tooltips.forEach(tooltip => {
        const tooltipId = getTooltipId(tooltip);
        const reviewCount = extractReviewCountFromTooltip(tooltip, tooltipId);
        if (reviewCount !== null) {
          reviewCounts.push(reviewCount);
          tooltipData[tooltipId] = reviewCount;
        }
      });
      return {
        reviewCounts,
        tooltipData
      };
    }
    function getTooltipId(tooltip) {
      return tooltip.parentElement.id;
    }
    function extractReviewCountFromTooltip(tooltip, tooltipId) {
      const smallCaption = tooltip.querySelector(TOOLTIP_CAPTION_SELECTOR);
      if (!smallCaption) {
        warn(`No small caption found for tooltip with ID: ${tooltipId}`);
        return null;
      }
      const reviewText = smallCaption.innerText.trim();
      log(`Processing tooltip with ID: ${tooltipId}, text: "${reviewText}"`);
      const reviewCount = parseReviewCount(reviewText);
      if (reviewCount !== null) {
        log(`Extracted review count: ${reviewCount}`);
        return reviewCount;
      } else {
        warn(`No review count found for tooltip with ID: ${tooltipId}`);
        return null;
      }
    }
    function parseReviewCount(text) {
      const match = text.match(REVIEW_COUNT_REGEX);
      return match ? parseInt(match[1], 10) : null;
    }

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
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      log("MutationObserver set up.");
    }
    function updateHeatmap() {
      removeElements([LEGENDS_SELECTOR, DIVIDERS_SELECTOR]);
      const tooltips = getElements(TOOLTIP_SELECTOR);
      if (!tooltips.length) {
        warn("No tooltips found. Waiting for DOM updates...");
        return;
      }
      const {
        reviewCounts,
        tooltipData
      } = extractTooltipData(tooltips);
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

})();
//# sourceMappingURL=bundle.js.map
