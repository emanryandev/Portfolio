import * as z from 'zod';

export const settingsSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters"),
  site_tagline: z.string().min(2, "Tagline must be at least 2 characters"),
  contact_email: z.string().email("Please enter a valid email address"),
  contact_phone: z.string().min(5, "Please enter a valid phone number"),
  contact_location: z.string().min(2, "Please enter a valid location"),
  seo_default_description: z.string().min(10, "SEO description should be at least 10 characters"),
  logo_url: z.string()
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
