'use server';

import { revalidatePath } from 'next/cache';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import { getSession, updateSession } from '@/lib/auth';
import { onboardingSchema, type OnboardingValues } from '@/lib/validations/onboardingSchema';

export async function completeOnboarding(data: OnboardingValues) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return { success: false, message: 'Authentication required' };
    }

    // Validate data
    const validated = onboardingSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: 'Invalid data format', errors: validated.error.format() };
    }

    await dbConnect();

    const updateData = {
      name: `${data.firstName} ${data.lastName}`,
      gender: data.gender,
      dob: new Date(data.dob),
      phoneNumber: data.phoneNumber,
      portfolioUrl: data.portfolioUrl,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      leetcodeUrl: data.leetcodeUrl,
      isOnboarded: true,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email: session.email },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, message: 'User not found' };
    }

    // Update the session cookie to reflect onboarding status
    await updateSession({ isOnboarded: true });

    revalidatePath('/');
    return { success: true, message: 'Onboarding completed successfully' };
  } catch (error: any) {
    console.error('Onboarding error:', error);
    return { success: false, message: error.message || 'Failed to complete onboarding' };
  }
}
