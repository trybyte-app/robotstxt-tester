import {
	FileTextIcon,
	LinkIcon,
	PlayIcon,
	Sparkles,
	TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { UserAgentSelector } from "./UserAgentSelector";

interface InputSectionProps {
	robotsTxt: string;
	urlList: string;
	selectedUserAgent: string;
	customUserAgent: string;
	isLoading: boolean;
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
		<Card className="grid-pattern border-white/10 bg-zinc-900/80 backdrop-blur-sm">
			<CardHeader className="border-b border-white/5">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-lg bg-white/5">
						<FileTextIcon className="size-5 text-zinc-400" />
					</div>
					<div>
						<CardTitle className="text-lg text-white">Configuration</CardTitle>
						<CardDescription className="text-zinc-500">
							Paste your robots.txt content and URLs to test
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-6 pt-6">
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Robots.txt Input */}
					<Field className="fixed-textarea">
						<FieldLabel className="flex items-center justify-between text-zinc-300">
							<span className="flex items-center gap-2">
								<FileTextIcon className="size-4 text-cyan-400" />
								robots.txt Content
							</span>
							{robotsLineCount > 0 && (
								<span className="font-mono text-xs text-zinc-500">
									{robotsLineCount} lines
								</span>
							)}
						</FieldLabel>
						<Textarea
							value={robotsTxt}
							onChange={(e) => onRobotsTxtChange(e.target.value)}
							placeholder={`User-agent: *\nDisallow: /admin/\nDisallow: /private/\nAllow: /\n\nUser-agent: Googlebot\nAllow: /`}
							className="h-56 max-h-56 overflow-auto border-white/10 bg-black/40 font-mono text-sm text-emerald-300 placeholder:text-zinc-600 focus:border-emerald-500/50"
						/>
					</Field>

					{/* URLs Input */}
					<Field className="fixed-textarea">
						<FieldLabel className="flex items-center justify-between text-zinc-300">
							<span className="flex items-center gap-2">
								<LinkIcon className="size-4 text-cyan-400" />
								URLs to Test
							</span>
							{urlCount > 0 && (
								<span className="font-mono text-xs text-zinc-500">
									{urlCount} URLs
								</span>
							)}
						</FieldLabel>
						<Textarea
							value={urlList}
							onChange={(e) => onUrlListChange(e.target.value)}
							placeholder={`https://example.com/\nhttps://example.com/admin/dashboard\nhttps://example.com/public/file.pdf\nhttps://example.com/api/v1/users`}
							className="h-56 max-h-56 overflow-auto border-white/10 bg-black/40 font-mono text-sm text-cyan-300 placeholder:text-zinc-600 focus:border-cyan-500/50"
						/>
					</Field>
				</div>

				{/* User Agent Selector */}
				<div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
					<UserAgentSelector
						selectedUserAgent={selectedUserAgent}
						customUserAgent={customUserAgent}
						onUserAgentChange={onUserAgentChange}
						onCustomUserAgentChange={onCustomUserAgentChange}
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
					<Button
						onClick={onTest}
						disabled={!canTest || isLoading}
						className="gap-2 bg-emerald-600 px-6 text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
					>
						{isLoading ? (
							<>
								<Sparkles className="size-4 animate-spin" />
								Processing...
							</>
						) : (
							<>
								<PlayIcon className="size-4" />
								Test URLs
							</>
						)}
					</Button>

					<Button
						variant="outline"
						onClick={onClear}
						className="border-white/10 text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
					>
						<TrashIcon className="size-4" />
						Clear All
					</Button>

					{canTest && (
						<span className="ml-auto text-xs text-zinc-500">
							Ready to test {urlCount} URL{urlCount !== 1 ? "s" : ""}
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
