import { PageHeader } from "@/components/page-header";
import { TestimonialEditor } from "@/app/(dashboard)/testimonials/testimonial-editor";

export const metadata = { title: "New testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="New testimonial" description="Add a guest review for the Reception section." />
      <TestimonialEditor />
    </div>
  );
}
