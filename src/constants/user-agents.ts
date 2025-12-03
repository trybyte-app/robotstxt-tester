import type { UserAgentOption } from "@/types/robots";

export const PREDEFINED_USER_AGENTS: UserAgentOption[] = [
	{ value: "Googlebot", label: "Googlebot" },
	{ value: "Googlebot-Image", label: "Googlebot-Image" },
	{ value: "GPTBot", label: "GPTBot (OpenAI)" },
	{ value: "meta-externalagent", label: "meta-externalagent (Meta)" },
	{ value: "Bingbot", label: "Bingbot" },
	{ value: "anthropic-ai", label: "anthropic-ai (Anthropic)" },
	{ value: "CCBot", label: "CCBot (Common Crawl)" },
	{ value: "Applebot", label: "Applebot" },
	{ value: "*", label: "* (All User-Agents)" },
];

export const CUSTOM_USER_AGENT_VALUE = "__custom__";

export const ITEMS_PER_PAGE = 100;

export const STORAGE_KEYS = {
	ROBOTS_TXT: "robotstxt-tester:robots-txt",
	URL_LIST: "robotstxt-tester:url-list",
	USER_AGENT: "robotstxt-tester:user-agent",
} as const;
