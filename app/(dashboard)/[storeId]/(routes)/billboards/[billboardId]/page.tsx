import prismadb from "@/lib/prismadb";
import { BillboardsForm } from "./components/billboards-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // Presence of billboard in database will determine whether
  // new billboard will be created or will update an exisiting billboard
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
