import { useCallback, useMemo, useState } from "react";

import { ParsedRobots } from "@trybyte/robotstxt-parser";

import {
	CUSTOM_USER_AGENT_VALUE,
	ITEMS_PER_PAGE,
	STORAGE_KEYS,
} from "@/constants/user-agents";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { clearAllStorage } from "@/lib/storage";
import { buildUrlTree, sortTree } from "@/lib/tree-builder";
import { validateUrls } from "@/lib/url-validation";
import type {
	ProcessedUrlResult,
	ResultsSummary,
	UrlTreeNode,
} from "@/types/robots";

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
	const testUrls = useCallback(() => {
		if (!robotsTxt.trim() || !urlList.trim() || !effectiveUserAgent.trim()) {
			return;
		}

		setIsLoading(true);
		setCurrentPage(1);

		// Use setTimeout to allow UI to update before heavy computation
		setTimeout(() => {
			try {
				const validationResults = validateUrls(urlList);
				const validUrls = validationResults
					.filter((r) => r.isValid)
					.map((r) => r.url);

				const parsed = ParsedRobots.parse(robotsTxt);
				const checkResults = parsed.checkUrls(effectiveUserAgent, validUrls);

				// Create a map for quick lookup
				const checkResultsMap = new Map(checkResults.map((r) => [r.url, r]));

				// Map check results back to validation results
				const processedResults: ProcessedUrlResult[] = validationResults.map(
					(validation) => {
						if (!validation.isValid) {
							return {
								url: validation.url,
								allowed: false,
								matchingLine: null,
								matchedPattern: null,
								matchedRuleType: null,
								isValidUrl: false,
								validationError: validation.error,
							};
						}

						const checkResult = checkResultsMap.get(validation.url);
						return {
							url: validation.url,
							allowed: checkResult?.allowed ?? true,
							matchingLine: checkResult?.matchingLine ?? null,
							matchedPattern: checkResult?.matchedPattern ?? null,
							matchedRuleType: checkResult?.matchedRuleType ?? null,
							isValidUrl: true,
						};
					},
				);

				setResults(processedResults);
			} catch (error) {
				console.error("Error testing URLs:", error);
			} finally {
				setIsLoading(false);
			}
		}, 10);
	}, [robotsTxt, urlList, effectiveUserAgent]);

	const clearData = useCallback(() => {
		clearAllStorage();
		setRobotsTxt("");
		setUrlList("");
		setSelectedUserAgent("Googlebot");
		setCustomUserAgent("");
		setResults([]);
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
