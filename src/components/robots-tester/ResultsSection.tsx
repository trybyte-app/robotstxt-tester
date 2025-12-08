import {
	ChartBarIcon,
	DownloadSimpleIcon,
	ListBulletsIcon,
	TreeStructureIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTab } from "@/components/ui/tabs";
import { exportToCsv } from "@/lib/csv-export";
import type {
	ProcessedUrlResult,
	ResultsSummary as ResultsSummaryType,
	UrlTreeNode,
} from "@/types/robots";

import { ResultsSummary } from "./ResultsSummary";
import { ResultsTableView } from "./ResultsTableView";
import { ResultsTreeView } from "./ResultsTreeView";

interface ResultsSectionProps {
	results: ProcessedUrlResult[];
	paginatedResults: ProcessedUrlResult[];
	summary: ResultsSummaryType;
	urlTree: UrlTreeNode;
	currentPage: number;
	totalPages: number;
	activeView: "table" | "tree";
	onPageChange: (page: number) => void;
	onViewChange: (view: "table" | "tree") => void;
}

export function ResultsSection({
	results,
	paginatedResults,
	summary,
	urlTree,
	currentPage,
	totalPages,
	activeView,
	onPageChange,
	onViewChange,
}: ResultsSectionProps) {
	const handleExport = () => {
		exportToCsv(results);
	};

	return (
		<div className="glass-panel rounded-2xl p-1.5 md:p-2">
			<div className="rounded-xl bg-black/40 border border-white/5 p-6 md:p-8">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
					<div className="flex items-center gap-4">
						<div className="size-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
							<ChartBarIcon className="size-6 text-(--color-purple)" />
						</div>
						<div>
							<h3 className="text-xl font-bold text-white tracking-tight">Analysis Report</h3>
							<p className="text-zinc-500 font-mono text-xs mt-1">
								STATUS: COMPLETE // ITEMS: {results.length}
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={handleExport}
						className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-(--color-acid) hover:text-(--color-acid) hover:bg-(--color-acid)/10 transition-all font-mono text-xs"
					>
						<DownloadSimpleIcon className="size-4" />
						EXPORT_DATA
					</Button>
				</div>

				<div className="flex flex-col gap-8">
					<ResultsSummary summary={summary} />

					<Tabs
						value={activeView}
						onValueChange={(v) => onViewChange(v as "table" | "tree")}
						className="w-full"
					>
						<TabsList className="w-full justify-start border-b border-white/10 bg-transparent p-0 mb-6">
							<TabsTab
								value="table"
								className="rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-mono text-sm text-zinc-500 hover:text-zinc-300 data-active:border-(--color-acid) data-active:text-(--color-acid) transition-all"
							>
								<ListBulletsIcon className="size-4 mr-2" />
								TABLE_VIEW
							</TabsTab>
							<TabsTab
								value="tree"
								className="rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-mono text-sm text-zinc-500 hover:text-zinc-300 data-active:border-(--color-purple) data-active:text-(--color-purple) transition-all"
							>
								<TreeStructureIcon className="size-4 mr-2" />
								TREE_STRUCTURE
							</TabsTab>
						</TabsList>

						<div className="relative min-h-[400px]">
							<TabsContent value="table" className="animate-slide-up">
								<ResultsTableView
									results={paginatedResults}
									currentPage={currentPage}
									totalPages={totalPages}
									totalResults={results.length}
									onPageChange={onPageChange}
								/>
							</TabsContent>

							<TabsContent value="tree" className="animate-slide-up">
								<ResultsTreeView tree={urlTree} />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
