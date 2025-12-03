import {
	AlertTriangleIcon,
	CheckCircle2Icon,
	HashIcon,
	XCircleIcon,
} from "lucide-react";

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
			<div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
				<div className="flex items-center gap-2 text-zinc-400">
					<HashIcon className="size-4" />
					<span className="text-xs font-medium tracking-wider uppercase">
						Total
					</span>
				</div>
				<p className="font-mono text-2xl font-bold text-white">
					{summary.total}
				</p>
			</div>

			{/* Allowed */}
			<div className="glow-success flex flex-col gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
				<div className="flex items-center gap-2 text-emerald-400">
					<CheckCircle2Icon className="size-4" />
					<span className="text-xs font-medium tracking-wider uppercase">
						Allowed
					</span>
				</div>
				<div className="flex items-baseline gap-2">
					<p className="font-mono text-2xl font-bold text-emerald-400">
						{summary.allowed}
					</p>
					<span className="text-sm text-emerald-400/60">{allowedPercent}%</span>
				</div>
			</div>

			{/* Disallowed */}
			<div className="glow-error flex flex-col gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
				<div className="flex items-center gap-2 text-red-400">
					<XCircleIcon className="size-4" />
					<span className="text-xs font-medium tracking-wider uppercase">
						Disallowed
					</span>
				</div>
				<div className="flex items-baseline gap-2">
					<p className="font-mono text-2xl font-bold text-red-400">
						{summary.disallowed}
					</p>
					<span className="text-sm text-red-400/60">
						{summary.total > 0
							? Math.round((summary.disallowed / summary.total) * 100)
							: 0}
						%
					</span>
				</div>
			</div>

			{/* Invalid */}
			<div className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
				<div className="flex items-center gap-2 text-amber-400">
					<AlertTriangleIcon className="size-4" />
					<span className="text-xs font-medium tracking-wider uppercase">
						Invalid
					</span>
				</div>
				<p className="font-mono text-2xl font-bold text-amber-400">
					{summary.invalid}
				</p>
			</div>
		</div>
	);
}
