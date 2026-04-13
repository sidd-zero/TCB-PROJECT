import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  avatarUrl: z.string().url('Invalid image URL').or(z.literal('')).optional(),
  portfolioUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  leetcodeUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']).optional(),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const securitySchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const privacySchema = z.object({
  searchIndexing: z.boolean(),
});

export type AccountValues = z.infer<typeof accountSchema>;
export type SecurityValues = z.infer<typeof securitySchema>;
export type PrivacyValues = z.infer<typeof privacySchema>;
