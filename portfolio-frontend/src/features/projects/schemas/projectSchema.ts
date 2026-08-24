import * as z from 'zod';

export const teamContributionSchema = z.object({
  id: z.number().optional(), // Existing contribution ID
  team_member_id: z.number().min(1, 'Please select a team member'),
  role: z.string().min(2, 'Role is required'),
  contribution_description: z.string().optional(),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  client_name: z.string().optional().nullable(),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  live_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  team_contributions: z.array(teamContributionSchema).default([]),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type TeamContributionFormValues = z.infer<typeof teamContributionSchema>;
