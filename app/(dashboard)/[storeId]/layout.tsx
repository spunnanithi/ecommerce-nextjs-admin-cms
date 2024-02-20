import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

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
    <div className="mx-auto max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
      <Navbar />
      {children}
    </div>
  );
}
