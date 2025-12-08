import {
	CaretDownIcon,
	CaretRightIcon,
	CheckCircleIcon,
	FileIcon,
	FolderSimpleIcon,
	GlobeSimpleIcon,
	XCircleIcon,
} from "@phosphor-icons/react";

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
				className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.05]"
				style={{ paddingLeft: `${depth * 20 + 8}px` }}
			>
				{hasChildren ? (
					<CollapsibleTrigger className="flex items-center rounded p-0.5 text-zinc-600 hover:text-[var(--color-acid)] hover:bg-[var(--color-acid)]/10 transition-colors">
						{isExpanded ? (
							<CaretDownIcon className="size-4" />
						) : (
							<CaretRightIcon className="size-4" />
						)}
					</CollapsibleTrigger>
				) : (
					<span className="w-5" />
				)}

				{isRoot ? (
					<GlobeSimpleIcon className="size-4 text-[var(--color-acid)]" />
				) : isDirectory ? (
					<FolderSimpleIcon className="size-4 text-[var(--color-purple)]" />
				) : (
					<FileIcon className="size-4 text-zinc-600" />
				)}

				<span
					className={`flex-1 truncate font-mono text-sm ${isRoot ? "font-bold text-white tracking-wide" : "text-zinc-400 group-hover:text-zinc-200"}`}
				>
					{node.name}
				</span>

				<div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
					{node.stats.allowed > 0 && (
						<span className="inline-flex items-center gap-1 rounded border border-[var(--color-acid)]/30 bg-[var(--color-acid)]/5 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-acid)]">
							<CheckCircleIcon className="size-3" weight="fill" />
							{node.stats.allowed}
						</span>
					)}
					{node.stats.disallowed > 0 && (
						<span className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/5 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
							<XCircleIcon className="size-3" weight="fill" />
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
							className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.03] group/item"
							style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
						>
							<span className="w-5" />
							{url.allowed ? (
								<CheckCircleIcon className="size-4 text-[var(--color-acid)]" />
							) : (
								<XCircleIcon className="size-4 text-red-500" />
							)}
							<span className="flex-1 truncate font-mono text-sm text-zinc-600 group-hover/item:text-zinc-400 transition-colors">
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
