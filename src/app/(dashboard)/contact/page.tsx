import { PageHeader } from "@/components/page-header";
import { ContactEditor } from "@/app/(dashboard)/contact/contact-editor";
import { createClient } from "@/lib/supabase/server";
import type { ContactInfo } from "@/types/content";

export const metadata = { title: "Contact & Footer" };
export const dynamic = "force-dynamic";

const defaultContact: ContactInfo = {
  id: "main",
  phone: "+233 (0) 540 120 400",
  email: "info@hotelawise.com",
  address: "No. 1 Wisepak Lane, New Asofan — Accra",
  maps_link: "https://www.google.com/maps/search/?api=1&query=Hotel+A-Wise+Accra",
  copyright_text: "Hotel A-Wise | © 2025",
  footer_tagline: "Affordable luxury, made in Accra.",
};

async function getContact(): Promise<ContactInfo> {
  const supabase = await createClient();
  const { data } = await supabase.from("contact").select("*").eq("id", "main").maybeSingle<ContactInfo>();
  return data ?? defaultContact;
}

export default async function ContactPage() {
  const contact = await getContact();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact & Footer"
        description="The phone, email, address and footer text shown across the public site."
      />
      <ContactEditor initial={contact} />
    </div>
  );
}
