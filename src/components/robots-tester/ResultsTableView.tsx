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
					<EmptyTitle className="text-zinc-300">NO_DATA</EmptyTitle>
					<EmptyDescription className="text-zinc-500 font-mono text-xs">
						AWAITING_INPUT_STREAM
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
				<div className="overflow-x-auto rounded-lg border border-white/10 bg-black/20">
					<Table>
						<TableHeader>
							<TableRow className="border-white/10 hover:bg-transparent">
								<TableHead className="w-16 text-zinc-500 font-mono text-xs uppercase tracking-wider">#</TableHead>
								<TableHead className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Target_URL</TableHead>
								<TableHead className="w-32 text-zinc-500 font-mono text-xs uppercase tracking-wider">Status</TableHead>
								<TableHead className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Matching_Rule</TableHead>
								<TableHead className="hidden sm:table-cell w-20 text-zinc-500 font-mono text-xs uppercase tracking-wider">Line</TableHead>
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
									<TableCell className="max-w-[180px] sm:max-w-xs md:max-w-md">
										<Tooltip>
											<TooltipTrigger className="block max-w-full cursor-default truncate font-mono text-sm text-zinc-300 hover:text-(--color-acid) transition-colors">
												{result.url}
											</TooltipTrigger>
											<TooltipContent
												side="bottom"
												align="start"
												className="max-w-lg font-mono text-xs bg-zinc-900 border-zinc-800 text-zinc-300"
											>
												{result.url}
											</TooltipContent>
										</Tooltip>
									</TableCell>
									<TableCell>
										{!result.isValidUrl ? (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-purple)/30 bg-(--color-purple)/10 px-2.5 py-1 text-xs font-mono font-bold text-(--color-purple)">
												<WarningIcon className="size-3" />
												INVALID
											</span>
										) : result.allowed ? (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-acid)/30 bg-(--color-acid)/10 px-2.5 py-1 text-xs font-mono font-bold text-(--color-acid)">
												<CheckCircleIcon className="size-3" />
												ALLOWED
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-mono font-bold text-red-500">
												<XCircleIcon className="size-3" />
												BLOCKED
											</span>
										)}
									</TableCell>
									<TableCell className="font-mono text-sm text-zinc-400">
										{result.matchedPattern ? (
											<span className="text-(--color-acid)">{result.matchedPattern}</span>
										) : (
											<span className="text-zinc-700">-</span>
										)}
									</TableCell>
									<TableCell className="hidden sm:table-cell text-center font-mono text-zinc-500">
										{result.matchingLine ?? (
											<span className="text-zinc-700">-</span>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{totalPages > 1 && (
					<div className="flex items-center justify-between border-t border-white/5 pt-4">
						<p className="text-sm text-zinc-500 font-mono">
							DISPLAYING{" "}
							<span className="text-zinc-300">
								{startIndex}-{endIndex}
							</span>{" "}
							OF <span className="text-zinc-300">{totalResults}</span>
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
												: "cursor-pointer hover:bg-white/5 hover:text-white"
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
													className={`cursor-pointer font-mono ${currentPage === pageNum ? "border-(--color-acid)/30 bg-(--color-acid)/10 text-(--color-acid)" : "hover:bg-white/5 hover:text-white"}`}
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
												: "cursor-pointer hover:bg-white/5 hover:text-white"
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
