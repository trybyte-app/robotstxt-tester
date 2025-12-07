import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RobotsTester } from "@/components/robots-tester";

function App() {
	return (
		<ErrorBoundary>
			<RobotsTester />
		</ErrorBoundary>
	);
}

export default App;
