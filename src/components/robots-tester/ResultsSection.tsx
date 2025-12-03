import { BarChart3Icon, DownloadIcon, ListIcon, TreesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
		<Card className="border-white/10 bg-zinc-900/80 backdrop-blur-sm">
			<CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-lg bg-white/5">
						<BarChart3Icon className="size-5 text-zinc-400" />
					</div>
					<div>
						<CardTitle className="text-lg text-white">Results</CardTitle>
						<p className="text-sm text-zinc-500">
							Analysis complete &middot; {results.length} URLs processed
						</p>
					</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={handleExport}
					className="border-white/10 text-zinc-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
				>
					<DownloadIcon className="size-4" />
					Export CSV
				</Button>
			</CardHeader>
			<CardContent className="flex flex-col gap-6 pt-6">
				<ResultsSummary summary={summary} />

				<Tabs
					value={activeView}
					onValueChange={(v) => onViewChange(v as "table" | "tree")}
				>
					<TabsList className="border border-white/10 bg-zinc-800/50">
						<TabsTab value="table" className="data-active:text-white">
							<ListIcon className="size-4" />
							Table View
						</TabsTab>
						<TabsTab value="tree" className="data-active:text-white">
							<TreesIcon className="size-4" />
							Tree View
						</TabsTab>
					</TabsList>

					<TabsContent value="table" className="mt-6">
						<ResultsTableView
							results={paginatedResults}
							currentPage={currentPage}
							totalPages={totalPages}
							totalResults={results.length}
							onPageChange={onPageChange}
						/>
					</TabsContent>

					<TabsContent value="tree" className="mt-6">
						<ResultsTreeView tree={urlTree} />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
