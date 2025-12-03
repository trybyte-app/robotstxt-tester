import { useCallback, useEffect, useState } from "react";

export function useLocalStorage(
	key: string,
	initialValue: string,
): [string, (value: string) => void] {
	const [storedValue, setStoredValue] = useState<string>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ?? initialValue;
		} catch {
			return initialValue;
		}
	});

	const setValue = useCallback(
		(value: string) => {
			setStoredValue(value);
			try {
				localStorage.setItem(key, value);
			} catch (error) {
				console.error("Failed to save to localStorage:", error);
			}
		},
		[key],
	);

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				setStoredValue(e.newValue);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [key]);

	return [storedValue, setValue];
}
