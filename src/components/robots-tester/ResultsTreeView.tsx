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
						<TreeStructureIcon className="text-zinc-400" />
					</EmptyMedia>
					<EmptyTitle className="text-zinc-300">No Tree Data</EmptyTitle>
					<EmptyDescription className="text-zinc-500">
						Run the test to see results in tree view
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
					className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-zinc-300 disabled:opacity-70"
				>
					{isExpandPending ? (
						<SpinnerGapIcon className="size-4 animate-spin" />
					) : (
						<CaretUpDownIcon className="size-4" />
					)}
					{isExpandPending ? "Expanding..." : "Expand All"}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={collapseAll}
					disabled={isCollapsePending}
					className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-zinc-300 disabled:opacity-70"
				>
					{isCollapsePending ? (
						<SpinnerGapIcon className="size-4 animate-spin" />
					) : (
						<CaretDoubleUpIcon className="size-4" />
					)}
					{isCollapsePending ? "Collapsing..." : "Collapse All"}
				</Button>
			</div>

			<ScrollArea className="h-[500px] rounded-xl border border-white/10 bg-black/20 p-4">
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
