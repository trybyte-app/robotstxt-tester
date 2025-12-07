import { useCallback, useMemo, useState } from "react";

import { ParsedRobots } from "@trybyte/robotstxt-parser";

import {
	CUSTOM_USER_AGENT_VALUE,
	ITEMS_PER_PAGE,
	STORAGE_KEYS,
} from "@/constants/user-agents";
import {
	CHUNK_SIZE,
	MAX_ROBOTS_TXT_SIZE,
	MAX_URL_COUNT,
	USER_AGENT_REGEX,
} from "@/constants/validation-limits";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { clearAllStorage } from "@/lib/storage";
import { buildUrlTree, sortTree } from "@/lib/tree-builder";
import { type UrlValidationResult, validateUrls } from "@/lib/url-validation";
import type {
	ProcessedUrlResult,
	ResultsSummary,
	UrlTreeNode,
} from "@/types/robots";

/**
 * Validates input before processing per RFC 9309 and library docs
 */
function validateInput(
	robotsTxt: string,
	urlList: string,
	userAgent: string,
): string | null {
	if (robotsTxt.length > MAX_ROBOTS_TXT_SIZE) {
		return `robots.txt exceeds maximum size of ${Math.round(MAX_ROBOTS_TXT_SIZE / 1024)} KiB`;
	}

	const urlCount = urlList.split("\n").filter((l) => l.trim()).length;
	if (urlCount > MAX_URL_COUNT) {
		return `Too many URLs (${urlCount}). Maximum is ${MAX_URL_COUNT}`;
	}

	// Validate user-agent format (allow * for all agents)
	if (userAgent !== "*" && !USER_AGENT_REGEX.test(userAgent)) {
		return "Invalid user-agent format. Only letters, underscores, and hyphens allowed";
	}

	return null;
}

/**
 * Processes URLs in chunks to avoid blocking the main thread
 */
async function processUrlsInChunks(
	validationResults: UrlValidationResult[],
	parsed: ParsedRobots,
	effectiveUserAgent: string,
): Promise<ProcessedUrlResult[]> {
	const results: ProcessedUrlResult[] = [];
	const validUrls = validationResults.filter((r) => r.isValid);

	// Process valid URLs in chunks
	for (let i = 0; i < validUrls.length; i += CHUNK_SIZE) {
		const chunk = validUrls.slice(i, i + CHUNK_SIZE);
		const urls = chunk.map((r) => r.url);

		// Check this batch against robots.txt
		const checkResults = parsed.checkUrls(effectiveUserAgent, urls);
		const checkMap = new Map(checkResults.map((r) => [r.url, r]));

		// Map results
		for (const validation of chunk) {
			const checkResult = checkMap.get(validation.url);
			results.push({
				url: validation.url,
				allowed: checkResult?.allowed ?? true,
				matchingLine: checkResult?.matchingLine ?? null,
				matchedPattern: checkResult?.matchedPattern ?? null,
				// Default to "none" when no rule matched
				matchedRuleType: checkResult?.matchedRuleType ?? "none",
				isValidUrl: true,
			});
		}

		// Yield to main thread to keep UI responsive
		await new Promise((r) => setTimeout(r, 0));
	}

	// Add invalid URLs to results
	for (const validation of validationResults.filter((r) => !r.isValid)) {
		results.push({
			url: validation.url,
			allowed: false,
			matchingLine: null,
			matchedPattern: null,
			matchedRuleType: null,
			isValidUrl: false,
			validationError: validation.error ?? "Invalid URL",
		});
	}

	return results;
}

export function useRobotsTester() {
	// Persisted state
	const [robotsTxt, setRobotsTxt] = useLocalStorage(
		STORAGE_KEYS.ROBOTS_TXT,
		"",
	);
	const [urlList, setUrlList] = useLocalStorage(STORAGE_KEYS.URL_LIST, "");
	const [selectedUserAgent, setSelectedUserAgent] = useLocalStorage(
		STORAGE_KEYS.USER_AGENT,
		"Googlebot",
	);

	// Non-persisted state
	const [customUserAgent, setCustomUserAgent] = useState("");
	const [results, setResults] = useState<ProcessedUrlResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [inputError, setInputError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [activeView, setActiveView] = useState<"table" | "tree">("table");

	// Computed values
	const effectiveUserAgent = useMemo(() => {
		return selectedUserAgent === CUSTOM_USER_AGENT_VALUE
			? customUserAgent
			: selectedUserAgent;
	}, [selectedUserAgent, customUserAgent]);

	const summary: ResultsSummary = useMemo(() => {
		return results.reduce(
			(acc, result) => {
				acc.total++;
				if (!result.isValidUrl) {
					acc.invalid++;
				} else if (result.allowed) {
					acc.allowed++;
				} else {
					acc.disallowed++;
				}
				return acc;
			},
			{ total: 0, allowed: 0, disallowed: 0, invalid: 0 },
		);
	}, [results]);

	const paginatedResults = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		const end = start + ITEMS_PER_PAGE;
		return results.slice(start, end);
	}, [results, currentPage]);

	const totalPages = useMemo(() => {
		return Math.ceil(results.length / ITEMS_PER_PAGE);
	}, [results.length]);

	const urlTree: UrlTreeNode = useMemo(() => {
		const tree = buildUrlTree(results);
		sortTree(tree);
		return tree;
	}, [results]);

	// Actions
	const testUrls = useCallback(async () => {
		if (!robotsTxt.trim() || !urlList.trim() || !effectiveUserAgent.trim()) {
			return;
		}

		// Clear previous error
		setInputError(null);

		// Validate input before processing (per RFC 9309 and library docs)
		const validationError = validateInput(
			robotsTxt,
			urlList,
			effectiveUserAgent,
		);
		if (validationError) {
			setInputError(validationError);
			return;
		}

		setIsLoading(true);
		setCurrentPage(1);

		try {
			const validationResults = validateUrls(urlList);
			const parsed = ParsedRobots.parse(robotsTxt);

			// Process URLs in chunks to keep UI responsive
			const processedResults = await processUrlsInChunks(
				validationResults,
				parsed,
				effectiveUserAgent,
			);

			setResults(processedResults);
		} catch (error) {
			console.error("Error testing URLs:", error);
			setInputError(
				error instanceof Error ? error.message : "An error occurred",
			);
		} finally {
			setIsLoading(false);
		}
	}, [robotsTxt, urlList, effectiveUserAgent]);

	const clearData = useCallback(() => {
		clearAllStorage();
		setRobotsTxt("");
		setUrlList("");
		setSelectedUserAgent("Googlebot");
		setCustomUserAgent("");
		setResults([]);
		setInputError(null);
		setCurrentPage(1);
	}, [setRobotsTxt, setUrlList, setSelectedUserAgent]);

	return {
		// State
		robotsTxt,
		urlList,
		selectedUserAgent,
		customUserAgent,
		results,
		isLoading,
		inputError,
		currentPage,
		activeView,

		// Computed
		effectiveUserAgent,
		summary,
		paginatedResults,
		totalPages,
		urlTree,

		// Actions
		setRobotsTxt,
		setUrlList,
		setSelectedUserAgent,
		setCustomUserAgent,
		setCurrentPage,
		setActiveView,
		testUrls,
		clearData,
	};
}
