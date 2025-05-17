import { TOOLTIP_CAPTION_SELECTOR } from './../constants.js';
import { log, warn } from './loggerService.js';

const REVIEW_COUNT_REGEX = /(\d+)\s+reviews/;

export function extractTooltipData(tooltips) {
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

    return { reviewCounts, tooltipData };
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

export function parseReviewCount(text) {
    const match = text.match(REVIEW_COUNT_REGEX);
    return match ? parseInt(match[1], 10) : null;
}