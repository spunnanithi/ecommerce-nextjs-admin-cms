import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <div className="p-5">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
