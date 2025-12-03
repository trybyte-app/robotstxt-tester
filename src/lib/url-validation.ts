import { z } from "zod";

const urlSchema = z.string().url("Invalid URL format");

export interface UrlValidationResult {
	url: string;
	isValid: boolean;
	error?: string;
}

export function validateUrl(url: string): UrlValidationResult {
	const trimmedUrl = url.trim();

	if (!trimmedUrl) {
		return { url: trimmedUrl, isValid: false, error: "URL is empty" };
	}

	const result = urlSchema.safeParse(trimmedUrl);

	if (result.success) {
		return { url: trimmedUrl, isValid: true };
	}

	return {
		url: trimmedUrl,
		isValid: false,
		error: result.error.issues[0]?.message ?? "Invalid URL",
	};
}

export function validateUrls(urlsText: string): UrlValidationResult[] {
	const urls = urlsText
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	return urls.map(validateUrl);
}
