export interface UrlCheckResult {
	url: string;
	allowed: boolean;
	matchingLine: number | null;
	matchedPattern: string | null;
	matchedRuleType: "allow" | "disallow" | "none" | null;
}

export interface ProcessedUrlResult extends UrlCheckResult {
	isValidUrl: boolean;
	validationError?: string;
}

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
