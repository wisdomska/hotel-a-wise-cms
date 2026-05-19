import { PageHeader } from "@/components/page-header";
import { RoomEditor } from "@/app/(dashboard)/rooms/room-editor";

export const metadata = { title: "New room" };

export default function NewRoomPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="New room" description="Create a room listing for the homepage and its own /rooms/[slug] page." />
      <RoomEditor />
    </div>
  );
}
