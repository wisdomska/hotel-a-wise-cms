export type Hero = {
  id?: string;
  headline: string;
  subtext: string;
  cta_text: string;
  cta_link: string;
  background_image_url: string;
  updated_at?: string;
};

export type Amenity = {
  id: string;
  name: string;
  type: "feature" | "coming_soon";
  description?: string | null;
  image_url?: string | null;
  display_order: number;
  status: "published" | "draft";
};

export type Room = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bed_summary: string;
  capacity: number;
  price_per_night: number | null;
  hero_image_url: string;
  gallery: string[] | null;
  display_order: number;
  status: "published" | "draft";
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  location: string | null;
  rating: number | null;
  featured: boolean;
  display_order: number;
  status: "published" | "draft";
};

export type ContactInfo = {
  id?: string;
  phone: string;
  email: string;
  address: string;
  maps_link: string | null;
  copyright_text: string;
  footer_tagline: string | null;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor";
};
