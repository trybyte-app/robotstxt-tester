import {
	CheckCircleIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	FileIcon,
	FolderIcon,
	GlobeIcon,
	XCircleIcon,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { UrlTreeNode } from "@/types/robots";

interface TreeNodeProps {
	node: UrlTreeNode;
	depth: number;
	expandedPaths: Set<string>;
	onToggle: (path: string) => void;
}

export function TreeNode({
	node,
	depth,
	expandedPaths,
	onToggle,
}: TreeNodeProps) {
	const isExpanded = expandedPaths.has(node.path);
	const hasChildren = node.children.length > 0 || node.urls.length > 0;
	const isDirectory = node.children.length > 0;
	const isRoot = depth === 0;

	return (
		<Collapsible open={isExpanded} onOpenChange={() => onToggle(node.path)}>
			<div
				className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]"
				style={{ paddingLeft: `${depth * 20 + 8}px` }}
			>
				{hasChildren ? (
					<CollapsibleTrigger className="flex items-center rounded p-0.5 hover:bg-white/10">
						{isExpanded ? (
							<ChevronDownIcon className="size-4 text-zinc-500" />
						) : (
							<ChevronRightIcon className="size-4 text-zinc-500" />
						)}
					</CollapsibleTrigger>
				) : (
					<span className="w-5" />
				)}

				{isRoot ? (
					<GlobeIcon className="size-4 text-cyan-400" />
				) : isDirectory ? (
					<FolderIcon className="size-4 text-amber-400/70" />
				) : (
					<FileIcon className="size-4 text-zinc-500" />
				)}

				<span
					className={`flex-1 truncate font-mono text-sm ${isRoot ? "font-medium text-cyan-300" : "text-zinc-300"}`}
				>
					{node.name}
				</span>

				<div className="flex items-center gap-1.5">
					{node.stats.allowed > 0 && (
						<span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
							<CheckCircleIcon className="size-3" />
							{node.stats.allowed}
						</span>
					)}
					{node.stats.disallowed > 0 && (
						<span className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
							<XCircleIcon className="size-3" />
							{node.stats.disallowed}
						</span>
					)}
				</div>
			</div>

			{hasChildren && (
				<CollapsibleContent>
					{node.children.map((child) => (
						<TreeNode
							key={child.path}
							node={child}
							depth={depth + 1}
							expandedPaths={expandedPaths}
							onToggle={onToggle}
						/>
					))}

					{node.urls.map((url, index) => (
						<div
							key={`${url.url}-${index}`}
							className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]"
							style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
						>
							<span className="w-5" />
							{url.allowed ? (
								<CheckCircleIcon className="size-4 text-emerald-400" />
							) : (
								<XCircleIcon className="size-4 text-red-400" />
							)}
							<span className="flex-1 truncate font-mono text-sm text-zinc-500">
								{getFileName(url.url)}
							</span>
						</div>
					))}
				</CollapsibleContent>
			)}
		</Collapsible>
	);
}

function getFileName(url: string): string {
	try {
		const parsed = new URL(url);
		const parts = parsed.pathname.split("/").filter(Boolean);
		const fileName = parts[parts.length - 1] || "/";
		// Include query string if present
		if (parsed.search) {
			return `${fileName}${parsed.search}`;
		}
		return fileName;
	} catch {
		return url;
	}
}
