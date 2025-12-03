import { STORAGE_KEYS } from "@/constants/user-agents";

export function saveToStorage(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		console.error("Failed to save to localStorage:", error);
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
