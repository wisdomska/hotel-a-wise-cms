import { PageHeader } from "@/components/page-header";
import { AmenityEditor } from "@/app/(dashboard)/amenities/amenity-editor";

export const metadata = { title: "New amenity" };

export default function NewAmenityPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="New amenity" description="Add an item to the marquee or a Coming Soon card." />
      <AmenityEditor />
    </div>
  );
}
