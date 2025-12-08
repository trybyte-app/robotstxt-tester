import {
	CheckCircleIcon,
	HashIcon,
	WarningIcon,
	XCircleIcon,
} from "@phosphor-icons/react";

import type { ResultsSummary as ResultsSummaryType } from "@/types/robots";

interface ResultsSummaryProps {
	summary: ResultsSummaryType;
}

export function ResultsSummary({ summary }: ResultsSummaryProps) {
	const allowedPercent =
		summary.total > 0 ? Math.round((summary.allowed / summary.total) * 100) : 0;

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			{/* Total */}
			<div className="group flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20">
				<div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
					<HashIcon className="size-4" />
					<span className="font-mono text-xs font-bold tracking-wider uppercase">
						Total_Urls
					</span>
				</div>
				<p className="font-mono text-3xl font-bold text-white">
					{summary.total}
				</p>
			</div>

			{/* Allowed */}
			<div className="group flex flex-col gap-2 rounded-lg border border-(--color-acid)/30 bg-(--color-acid)/5 p-4 transition-all hover:bg-(--color-acid)/10 hover:shadow-[0_0_20px_-5px_var(--color-acid-glow)]">
				<div className="flex items-center gap-2 text-(--color-acid)">
					<CheckCircleIcon className="size-4" />
					<span className="font-mono text-xs font-bold tracking-wider uppercase">
						Allowed
					</span>
				</div>
				<div className="flex items-baseline gap-2">
					<p className="font-mono text-3xl font-bold text-(--color-acid)">
						{summary.allowed}
					</p>
					<span className="text-sm font-mono text-(--color-acid)/60">{allowedPercent}%</span>
				</div>
			</div>

			{/* Disallowed */}
			<div className="group flex flex-col gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-4 transition-all hover:bg-red-500/10 hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]">
				<div className="flex items-center gap-2 text-red-500">
					<XCircleIcon className="size-4" />
					<span className="font-mono text-xs font-bold tracking-wider uppercase">
						Disallowed
					</span>
				</div>
				<div className="flex items-baseline gap-2">
					<p className="font-mono text-3xl font-bold text-red-500">
						{summary.disallowed}
					</p>
					<span className="text-sm font-mono text-red-500/60">
						{summary.total > 0
							? Math.round((summary.disallowed / summary.total) * 100)
							: 0}
						%
					</span>
				</div>
			</div>

			{/* Invalid */}
			<div className="group flex flex-col gap-2 rounded-lg border border-(--color-purple)/30 bg-(--color-purple)/5 p-4 transition-all hover:bg-(--color-purple)/10 hover:shadow-[0_0_20px_-5px_var(--color-purple-glow)]">
				<div className="flex items-center gap-2 text-(--color-purple)">
					<WarningIcon className="size-4" />
					<span className="font-mono text-xs font-bold tracking-wider uppercase">
						Invalid
					</span>
				</div>
				<p className="font-mono text-3xl font-bold text-(--color-purple)">
					{summary.invalid}
				</p>
			</div>
		</div>
	);
}
