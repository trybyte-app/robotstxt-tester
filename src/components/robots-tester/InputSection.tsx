import {
    FileTextIcon,
    LinkSimpleIcon,
    PlayIcon,
    SlidersIcon,
    SpinnerGapIcon,
    TrashIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { UserAgentSelector } from "./UserAgentSelector";

interface InputSectionProps {
	robotsTxt: string;
	urlList: string;
	selectedUserAgent: string;
	customUserAgent: string;
	isLoading: boolean;
	inputError: string | null;
	onRobotsTxtChange: (value: string) => void;
	onUrlListChange: (value: string) => void;
	onUserAgentChange: (value: string) => void;
	onCustomUserAgentChange: (value: string) => void;
	onTest: () => void;
	onClear: () => void;
}

export function InputSection({
	robotsTxt,
	urlList,
	selectedUserAgent,
	customUserAgent,
	isLoading,
	inputError,
	onRobotsTxtChange,
	onUrlListChange,
	onUserAgentChange,
	onCustomUserAgentChange,
	onTest,
	onClear,
}: InputSectionProps) {
	const canTest =
		robotsTxt.trim().length > 0 &&
		urlList.trim().length > 0 &&
		(selectedUserAgent !== "__custom__" || customUserAgent.trim().length > 0);

	const robotsLineCount = robotsTxt.split("\n").filter(Boolean).length;
	const urlCount = urlList.split("\n").filter((l) => l.trim()).length;

	return (
		<div className="glass-panel rounded-2xl p-1 md:p-2">
			<div className="rounded-xl bg-black/40 border border-white/5 p-4 sm:p-6 md:p-8">

				{/* Section Header */}
				<div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
					<div className="flex items-center gap-4">
						<div className="size-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
							<SlidersIcon className="size-6 text-acid" />
						</div>
						<div>
							<h3 className="text-xl font-bold text-white tracking-tight">Configuration Protocol</h3>
							<p className="text-zinc-500 font-mono text-xs mt-1">
								DEFINE_RULES // TARGET_URLS
							</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-8">
					<div className="grid gap-6 md:gap-8 md:grid-cols-2 items-stretch">
						{/* Robots.txt Input */}
						<Field className="fixed-textarea group">
							<FieldLabel className="flex items-center justify-between text-zinc-400 mb-3 group-focus-within:text-acid transition-colors w-full">
								<span className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
									<FileTextIcon className="size-4" />
									robots.txt
								</span>
								{robotsLineCount > 0 && (
									<span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">
										{robotsLineCount} LINES
									</span>
								)}
							</FieldLabel>
							<div className="relative w-full">
								<div className="absolute inset-0 bg-gradient-to-br from-acid/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none rounded-lg" />
								<Textarea
									value={robotsTxt}
									onChange={(e) => onRobotsTxtChange(e.target.value)}
									placeholder={`User-agent: *\nDisallow: /admin/\nDisallow: /private/\nAllow: /\n\nUser-agent: Googlebot\nAllow: /`}
									className="h-56 md:h-80 bg-zinc-950/50 border-white/10 font-mono text-sm leading-relaxed text-zinc-300 focus:border-acid focus:ring-acid/20 transition-all rounded-lg selection:bg-acid selection:text-black"
								/>
							</div>
						</Field>

						{/* URLs Input */}
						<Field className="fixed-textarea group">
							<FieldLabel className="flex items-center justify-between text-zinc-400 mb-3 group-focus-within:text-[var(--color-purple)] transition-colors w-full">
								<span className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
									<LinkSimpleIcon className="size-4" />
									Target URLs
								</span>
								{urlCount > 0 && (
									<span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">
										{urlCount} URLS
									</span>
								)}
							</FieldLabel>
							<div className="relative w-full">
								<div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none rounded-lg" />
								<Textarea
									value={urlList}
									onChange={(e) => onUrlListChange(e.target.value)}
									placeholder={`https://example.com/\nhttps://example.com/admin/dashboard\nhttps://example.com/public/file.pdf\nhttps://example.com/api/v1/users`}
									className="h-56 md:h-80 bg-zinc-950/50 border-white/10 font-mono text-sm leading-relaxed text-zinc-300 focus:border-[var(--color-purple)] focus:ring-purple/20 transition-all rounded-lg selection:bg-[var(--color-purple)] selection:text-white"
								/>
							</div>
						</Field>
					</div>

					{/* User Agent Selector */}
					<div className="p-1 rounded-xl bg-gradient-to-r from-zinc-800/50 to-zinc-900/50">
						<div className="bg-zinc-950/80 rounded-lg p-6 border border-white/5">
							<UserAgentSelector
								selectedUserAgent={selectedUserAgent}
								customUserAgent={customUserAgent}
								onUserAgentChange={onUserAgentChange}
								onCustomUserAgentChange={onCustomUserAgentChange}
							/>
						</div>
					</div>

					{/* Error Display */}
					{inputError && (
						<div className="animate-slide-up flex items-start gap-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4 relative overflow-hidden">
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
							<WarningCircleIcon className="mt-0.5 size-5 shrink-0 text-red-500" />
							<div className="flex flex-col gap-1">
								<span className="font-bold font-mono text-red-500 uppercase text-xs tracking-wider">Validation Error</span>
								<span className="text-sm text-red-200/80">{inputError}</span>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
						<Button
							onClick={onTest}
							disabled={!canTest || isLoading}
							className="w-full sm:w-auto h-12 px-8 bg-acid text-black font-bold tracking-wide hover:bg-[#b8dd00] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_var(--color-acid-glow)] transition-all hover:scale-105 active:scale-95 rounded-lg"
						>
							{isLoading ? (
								<>
									<SpinnerGapIcon className="size-5 animate-spin" />
									PROCESSING...
								</>
							) : (
								<>
									<PlayIcon className="size-5" weight="fill" />
									INITIATE TEST
								</>
							)}
						</Button>

						<Button
							variant="outline"
							onClick={onClear}
							className="w-full sm:w-auto h-12 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors rounded-lg"
						>
							<TrashIcon className="size-4" />
							RESET
						</Button>

						{canTest && (
							<div className="hidden sm:block ml-auto font-mono text-xs text-zinc-600 animate-pulse">
								READY_TO_PROCESS: {urlCount}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
