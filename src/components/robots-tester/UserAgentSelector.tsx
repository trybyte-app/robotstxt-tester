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
		<div className="flex flex-col gap-4 sm:flex-row sm:items-end">
			<Field className="sm:w-64">
				<FieldLabel>User-Agent</FieldLabel>
				<Select value={selectedUserAgent} onValueChange={handleValueChange}>
					<SelectTrigger>
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
				<Field className="flex-1">
					<FieldLabel>Custom User-Agent</FieldLabel>
					<Input
						value={customUserAgent}
						onChange={(e) => onCustomUserAgentChange(e.target.value)}
						placeholder="Enter custom user-agent string"
					/>
					<FieldDescription>
						Enter the exact user-agent string to test
					</FieldDescription>
				</Field>
			)}
		</div>
	);
}
