import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
	return (
		<div className="h-screen">
			<UserButton afterSignOutUrl="/" />
		</div>
	);
}
