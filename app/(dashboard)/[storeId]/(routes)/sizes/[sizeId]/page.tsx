import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  // Presence of billboard in database will determine whether
  // new billboard will be created or will update an exisiting billboard
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
