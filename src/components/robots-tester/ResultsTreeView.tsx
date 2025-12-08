import { useState, useTransition } from "react";
import {
	CaretDoubleUpIcon,
	CaretUpDownIcon,
	SpinnerGapIcon,
	TreeStructureIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UrlTreeNode } from "@/types/robots";

import { TreeNode } from "./TreeNode";

interface ResultsTreeViewProps {
	tree: UrlTreeNode;
}

export function ResultsTreeView({ tree }: ResultsTreeViewProps) {
	const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
	const [isExpandPending, startExpandTransition] = useTransition();
	const [isCollapsePending, startCollapseTransition] = useTransition();

	const toggleExpanded = (path: string) => {
		setExpandedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) {
				next.delete(path);
			} else {
				next.add(path);
			}
			return next;
		});
	};

	const expandAll = () => {
		startExpandTransition(() => {
			const allPaths = collectAllPaths(tree);
			setExpandedPaths(new Set(allPaths));
		});
	};

	const collapseAll = () => {
		startCollapseTransition(() => {
			setExpandedPaths(new Set());
		});
	};

	if (tree.children.length === 0) {
		return (
			<Empty className="border-white/10 bg-black/20">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<TreeStructureIcon className="text-zinc-500" />
					</EmptyMedia>
					<EmptyTitle className="text-zinc-400 font-mono tracking-wide">NO_STRUCTURE</EmptyTitle>
					<EmptyDescription className="text-zinc-600 font-mono text-xs">
						EXECUTE_ANALYSIS_TO_VISUALIZE
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={expandAll}
					disabled={isExpandPending}
					className="border-white/10 bg-zinc-900/50 text-zinc-400 hover:bg-[var(--color-acid)]/10 hover:border-[var(--color-acid)]/50 hover:text-[var(--color-acid)] disabled:opacity-50 font-mono text-xs"
				>
					{isExpandPending ? (
						<SpinnerGapIcon className="size-4 animate-spin" />
					) : (
						<CaretUpDownIcon className="size-4" />
					)}
					{isExpandPending ? "EXPANDING..." : "EXPAND_ALL"}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={collapseAll}
					disabled={isCollapsePending}
					className="border-white/10 bg-zinc-900/50 text-zinc-400 hover:bg-[var(--color-purple)]/10 hover:border-[var(--color-purple)]/50 hover:text-[var(--color-purple)] disabled:opacity-50 font-mono text-xs"
				>
					{isCollapsePending ? (
						<SpinnerGapIcon className="size-4 animate-spin" />
					) : (
						<CaretDoubleUpIcon className="size-4" />
					)}
					{isCollapsePending ? "COLLAPSING..." : "COLLAPSE_ALL"}
				</Button>
			</div>

			<ScrollArea className="h-[350px] sm:h-[400px] md:h-[500px] rounded-lg border border-white/10 bg-black/20 p-4">
				<div className="flex flex-col gap-0.5">
					{tree.children.map((child) => (
						<TreeNode
							key={child.path}
							node={child}
							depth={0}
							expandedPaths={expandedPaths}
							onToggle={toggleExpanded}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

function collectAllPaths(node: UrlTreeNode): string[] {
	const paths: string[] = [node.path];
	for (const child of node.children) {
		paths.push(...collectAllPaths(child));
	}
	return paths;
}
