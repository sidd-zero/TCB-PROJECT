import { z } from 'zod';

export const personalSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other']),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone format'),
});

export const professionalSchema = z.object({
  email: z.string().email('Invalid email address'),
  portfolioUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

export const socialSchema = z.object({
  linkedinUrl: z.string().url('Invalid LinkedIn URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')).optional(),
  leetcodeUrl: z.string().url('Invalid LeetCode URL').or(z.literal('')).optional(),
});

export const onboardingSchema = personalSchema.merge(professionalSchema).merge(socialSchema);

export type OnboardingValues = z.infer<typeof onboardingSchema>;
export type PersonalValues = z.infer<typeof personalSchema>;
export type ProfessionalValues = z.infer<typeof professionalSchema>;
export type SocialValues = z.infer<typeof socialSchema>;
