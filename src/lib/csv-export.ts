import type { ProcessedUrlResult } from "@/types/robots";

export function exportToCsv(results: ProcessedUrlResult[]): void {
	const headers = [
		"URL",
		"Status",
		"Matching Pattern",
		"Rule Type",
		"Line Number",
	];

	const rows = results.map((result) => [
		escapeCSVField(result.url),
		result.isValidUrl ? (result.allowed ? "Allowed" : "Disallowed") : "Invalid",
		escapeCSVField(result.matchedPattern ?? ""),
		result.matchedRuleType ?? "",
		result.matchingLine?.toString() ?? "",
	]);

	const csvContent = [
		headers.join(","),
		...rows.map((row) => row.join(",")),
	].join("\n");

	downloadCsv(csvContent, "robots-test-results.csv");
}

// Characters that can trigger formula execution in spreadsheet applications
const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function escapeCSVField(field: string): string {
	let escaped = field;

	// Prevent CSV injection by prefixing formula characters with single quote
	if (FORMULA_PREFIXES.some((prefix) => field.startsWith(prefix))) {
		escaped = `'${field}`;
	}

	if (
		escaped.includes(",") ||
		escaped.includes("\n") ||
		escaped.includes('"')
	) {
		return `"${escaped.replace(/"/g, '""')}"`;
	}
	return escaped;
}

function downloadCsv(content: string, filename: string): void {
	const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.style.display = "none";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}
