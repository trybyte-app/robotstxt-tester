import { useCallback, useEffect, useState } from "react";

import { type StorageResult, saveToStorage } from "@/lib/storage";

export type SetValueResult = StorageResult;

export function useLocalStorage(
	key: string,
	initialValue: string,
): [string, (value: string) => SetValueResult] {
	const [storedValue, setStoredValue] = useState<string>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ?? initialValue;
		} catch {
			return initialValue;
		}
	});

	const setValue = useCallback(
		(value: string): SetValueResult => {
			const result = saveToStorage(key, value);

			// Only update React state if storage was successful
			if (result.success) {
				setStoredValue(value);
			} else if (result.error === "quota") {
				// On quota error, still update local state but warn user
				// This allows the UI to reflect changes even if not persisted
				console.warn(
					"Storage quota exceeded - changes may not persist after refresh",
				);
				setStoredValue(value);
			}

			return result;
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
