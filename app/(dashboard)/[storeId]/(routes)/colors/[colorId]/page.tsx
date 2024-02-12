import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  // Presence of billboard in database will determine whether
  // new billboard will be created or will update an exisiting billboard
  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
