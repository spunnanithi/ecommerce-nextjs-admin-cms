import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  // User is not found so redirect to sign-in page
  if (!userId) {
    redirect("/sign-in");
  }

  // Query db for store that matches storeId and userId
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // Store is not found in db so redirect to home page
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <div>NavBar Here</div>
      {children}
    </>
  );
}
