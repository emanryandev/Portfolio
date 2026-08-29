import * as z from 'zod';

export const teamContributionSchema = z.object({
  id: z.string().optional(), // Existing contribution ID (Firebase)
  team_member_id: z.string().min(1, 'Please select a team member'),
  role: z.string().min(2, 'Role is required'),
  contribution_description: z.string().optional(),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  name: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  client_name: z.string().nullable().optional(),
  summary: z.string().min(10, "Summary is required"),
  description: z.string().min(10, "Description is required"),
  cover_image: z.string().nullable().optional(),
  live_url: z.string().url("Must be a valid URL").nullable().optional().or(z.literal('')),
  github_url: z.string().url("Must be a valid URL").nullable().optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  team_contributions: z.array(teamContributionSchema).default([]),
  is_featured: z.boolean().default(false),
  published_at: z.string().nullable().optional(),
  order: z.number().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type TeamContributionFormValues = z.infer<typeof teamContributionSchema>;
