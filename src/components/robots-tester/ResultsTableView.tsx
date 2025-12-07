import {
	CheckCircleIcon,
	WarningIcon,
	XCircleIcon,
} from "@phosphor-icons/react";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ITEMS_PER_PAGE } from "@/constants/user-agents";
import type { ProcessedUrlResult } from "@/types/robots";

interface ResultsTableViewProps {
	results: ProcessedUrlResult[];
	currentPage: number;
	totalPages: number;
	totalResults: number;
	onPageChange: (page: number) => void;
}

export function ResultsTableView({
	results,
	currentPage,
	totalPages,
	totalResults,
	onPageChange,
}: ResultsTableViewProps) {
	if (results.length === 0) {
		return (
			<Empty className="border-white/10 bg-black/20">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<WarningIcon className="text-zinc-400" />
					</EmptyMedia>
					<EmptyTitle className="text-zinc-300">No Results</EmptyTitle>
					<EmptyDescription className="text-zinc-500">
						Enter URLs and run the test to see results
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
	const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalResults);

	return (
		<TooltipProvider>
			<div className="flex flex-col gap-4">
				<div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
					<Table>
						<TableHeader>
							<TableRow className="border-white/10 hover:bg-transparent">
								<TableHead className="w-16 text-zinc-500">#</TableHead>
								<TableHead className="text-zinc-500">URL</TableHead>
								<TableHead className="w-32 text-zinc-500">Status</TableHead>
								<TableHead className="text-zinc-500">Matching Rule</TableHead>
								<TableHead className="w-20 text-zinc-500">Line</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{results.map((result, index) => (
								<TableRow
									key={`${result.url}-${index}`}
									className="border-white/5 hover:bg-white/[0.02]"
								>
									<TableCell className="font-mono text-zinc-600">
										{startIndex + index}
									</TableCell>
									<TableCell className="max-w-md">
										<Tooltip>
											<TooltipTrigger className="block max-w-full cursor-default truncate font-mono text-sm text-zinc-300">
												{result.url}
											</TooltipTrigger>
											<TooltipContent
												side="bottom"
												align="start"
												className="max-w-lg font-mono text-xs"
											>
												{result.url}
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell>
										{!result.isValidUrl ? (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
												<WarningIcon className="size-3" />
												Invalid
											</span>
										) : result.allowed ? (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
												<CheckCircleIcon className="size-3" />
												Allowed
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
												<XCircleIcon className="size-3" />
												Disallowed
											</span>
										)}
									</TableCell>
									<TableCell className="font-mono text-sm text-cyan-300">
										{result.matchedPattern ?? (
											<span className="text-zinc-600">-</span>
										)}
									</TableCell>
									<TableCell className="text-center font-mono text-zinc-400">
										{result.matchingLine ?? (
											<span className="text-zinc-600">-</span>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{totalPages > 1 && (
					<div className="flex items-center justify-between">
						<p className="text-sm text-zinc-500">
							Showing{" "}
							<span className="font-mono text-zinc-300">
								{startIndex}-{endIndex}
							</span>{" "}
							of <span className="font-mono text-zinc-300">{totalResults}</span>{" "}
							results
						</p>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() => onPageChange(Math.max(1, currentPage - 1))}
										aria-disabled={currentPage === 1}
										className={
											currentPage === 1
												? "pointer-events-none opacity-50"
												: "cursor-pointer hover:bg-white/5"
										}
									/>
								</PaginationItem>

								{generatePageNumbers(currentPage, totalPages).map(
									(pageNum, idx) =>
										pageNum === "ellipsis" ? (
											<PaginationItem key={`ellipsis-${idx}`}>
												<PaginationEllipsis />
											</PaginationItem>
										) : (
											<PaginationItem key={pageNum}>
												<PaginationLink
													onClick={() => onPageChange(pageNum)}
													isActive={currentPage === pageNum}
													className={`cursor-pointer ${currentPage === pageNum ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "hover:bg-white/5"}`}
												>
													{pageNum}
												</PaginationLink>
											</PaginationItem>
										),
								)}

								<PaginationItem>
									<PaginationNext
										onClick={() =>
											onPageChange(Math.min(totalPages, currentPage + 1))
										}
										aria-disabled={currentPage === totalPages}
										className={
											currentPage === totalPages
												? "pointer-events-none opacity-50"
												: "cursor-pointer hover:bg-white/5"
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}

function generatePageNumbers(
	current: number,
	total: number,
): (number | "ellipsis")[] {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	const pages: (number | "ellipsis")[] = [];

	pages.push(1);

	if (current > 3) {
		pages.push("ellipsis");
	}

	const start = Math.max(2, current - 1);
	const end = Math.min(total - 1, current + 1);

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	if (current < total - 2) {
		pages.push("ellipsis");
	}

	if (total > 1) {
		pages.push(total);
	}

	return pages;
}
