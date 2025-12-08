import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CUSTOM_USER_AGENT_VALUE,
	PREDEFINED_USER_AGENTS,
} from "@/constants/user-agents";

interface UserAgentSelectorProps {
	selectedUserAgent: string;
	customUserAgent: string;
	onUserAgentChange: (value: string) => void;
	onCustomUserAgentChange: (value: string) => void;
}

export function UserAgentSelector({
	selectedUserAgent,
	customUserAgent,
	onUserAgentChange,
	onCustomUserAgentChange,
}: UserAgentSelectorProps) {
	const isCustom = selectedUserAgent === CUSTOM_USER_AGENT_VALUE;

	const handleValueChange = (value: string | null) => {
		if (value) {
			onUserAgentChange(value);
		}
	};

	return (
		<div className="grid gap-4 sm:grid-cols-[256px_1fr] sm:items-start">
			<Field>
				<FieldLabel className="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">
					User-Agent
				</FieldLabel>
				<Select value={selectedUserAgent} onValueChange={handleValueChange}>
					<SelectTrigger className="h-10 bg-zinc-950/50 border-white/10">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PREDEFINED_USER_AGENTS.map((agent) => (
							<SelectItem key={agent.value} value={agent.value}>
								{agent.label}
							</SelectItem>
						))}
						<SelectItem value={CUSTOM_USER_AGENT_VALUE}>Custom...</SelectItem>
					</SelectContent>
				</Select>
			</Field>

			{isCustom && (
				<Field>
					<FieldLabel className="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">
						Custom User-Agent
					</FieldLabel>
					<Input
						value={customUserAgent}
						onChange={(e) => onCustomUserAgentChange(e.target.value)}
						placeholder="Enter custom user-agent string"
						className="h-10 bg-zinc-950/50 border-white/10"
					/>
					<FieldDescription className="text-zinc-600 text-xs mt-1.5">
						Enter the exact user-agent string to test
					</FieldDescription>
				</Field>
			)}
		</div>
	);
}
