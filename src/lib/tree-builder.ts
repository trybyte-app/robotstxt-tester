import type { ProcessedUrlResult, UrlTreeNode } from "@/types/robots";

export function buildUrlTree(results: ProcessedUrlResult[]): UrlTreeNode {
	const root: UrlTreeNode = {
		name: "root",
		path: "/",
		children: [],
		urls: [],
		stats: { total: 0, allowed: 0, disallowed: 0 },
	};

	for (const result of results) {
		if (!result.isValidUrl) continue;

		try {
			const url = new URL(result.url);
			const pathParts = url.pathname
				.split("/")
				.filter((part) => part.length > 0);

			// Start with hostname as first level
			let currentNode = findOrCreateChild(root, url.hostname, url.hostname);

			// Build path hierarchy
			let currentPath = url.hostname;
			for (const part of pathParts) {
				currentPath = `${currentPath}/${part}`;
				currentNode = findOrCreateChild(currentNode, part, currentPath);
			}

			// Add URL to the leaf node
			currentNode.urls.push(result);
		} catch {
			// Skip invalid URLs
			continue;
		}
	}

	// Calculate stats recursively
	calculateStats(root);

	return root;
}

function findOrCreateChild(
	parent: UrlTreeNode,
	name: string,
	path: string,
): UrlTreeNode {
	let child = parent.children.find((c) => c.name === name);

	if (!child) {
		child = {
			name,
			path,
			children: [],
			urls: [],
			stats: { total: 0, allowed: 0, disallowed: 0 },
			isExpanded: false,
		};
		parent.children.push(child);
	}

	return child;
}

function calculateStats(node: UrlTreeNode): void {
	// Reset stats
	node.stats = { total: 0, allowed: 0, disallowed: 0 };

	// Add stats from direct URLs
	for (const url of node.urls) {
		node.stats.total++;
		if (url.allowed) {
			node.stats.allowed++;
		} else {
			node.stats.disallowed++;
		}
	}

	// Recursively calculate and aggregate child stats
	for (const child of node.children) {
		calculateStats(child);
		node.stats.total += child.stats.total;
		node.stats.allowed += child.stats.allowed;
		node.stats.disallowed += child.stats.disallowed;
	}
}

export function sortTree(node: UrlTreeNode): void {
	node.children.sort((a, b) => {
		const aHasChildren = a.children.length > 0;
		const bHasChildren = b.children.length > 0;

		if (aHasChildren && !bHasChildren) return -1;
		if (!aHasChildren && bHasChildren) return 1;
		return a.name.localeCompare(b.name);
	});

	for (const child of node.children) {
		sortTree(child);
	}
}
