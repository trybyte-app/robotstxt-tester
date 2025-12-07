export interface UrlCheckResult {
	url: string;
	allowed: boolean;
	matchingLine: number | null;
	matchedPattern: string | null;
	matchedRuleType: "allow" | "disallow" | "none" | null;
}

/**
 * Result for a valid URL that was successfully checked against robots.txt
 */
interface ValidUrlResult {
	isValidUrl: true;
	url: string;
	allowed: boolean;
	matchingLine: number | null;
	matchedPattern: string | null;
	matchedRuleType: "allow" | "disallow" | "none";
}

/**
 * Result for an invalid URL that failed validation
 */
interface InvalidUrlResult {
	isValidUrl: false;
	url: string;
	allowed: false;
	matchingLine: null;
	matchedPattern: null;
	matchedRuleType: null;
	validationError: string;
}

/**
 * Discriminated union type for processed URL results.
 * Use `result.isValidUrl` to narrow the type.
 */
export type ProcessedUrlResult = ValidUrlResult | InvalidUrlResult;

export interface UrlTreeNode {
	name: string;
	path: string;
	children: UrlTreeNode[];
	urls: ProcessedUrlResult[];
	stats: {
		total: number;
		allowed: number;
		disallowed: number;
	};
	isExpanded?: boolean;
}

export interface ResultsSummary {
	total: number;
	allowed: number;
	disallowed: number;
	invalid: number;
}

export interface UserAgentOption {
	value: string;
	label: string;
}
