import { STORAGE_KEYS } from "@/constants/user-agents";

export type StorageResult =
	| { success: true }
	| { success: false; error: "quota" | "unknown" };

export function saveToStorage(key: string, value: string): StorageResult {
	try {
		localStorage.setItem(key, value);
		return { success: true };
	} catch (error) {
		// Detect quota exceeded error (different browsers report it differently)
		if (
			error instanceof DOMException &&
			(error.name === "QuotaExceededError" || error.code === 22)
		) {
			console.warn("localStorage quota exceeded");
			return { success: false, error: "quota" };
		}
		console.error("Failed to save to localStorage:", error);
		return { success: false, error: "unknown" };
	}
}

export function loadFromStorage(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error("Failed to load from localStorage:", error);
		return null;
	}
}

export function clearAllStorage(): void {
	try {
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
		});
	} catch (error) {
		console.error("Failed to clear localStorage:", error);
	}
}
