'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { accountSchema, securitySchema } from '@/lib/validations/settingsSchema';

/**
 * Update user profile information
 */
export async function updateProfile(data: any) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      throw new Error('Unauthorized');
    }

    const validated = accountSchema.parse(data);
    await dbConnect();

    const user = await User.findOneAndUpdate(
      { email: session.email },
      { 
        name: validated.name,
        bio: validated.bio,
        avatarUrl: validated.avatarUrl,
        portfolioUrl: validated.portfolioUrl,
        linkedinUrl: validated.linkedinUrl,
        githubUrl: validated.githubUrl,
        leetcodeUrl: validated.leetcodeUrl,
        gender: validated.gender,
        dob: validated.dob,
        phoneNumber: validated.phoneNumber,
      },
      { new: true, upsert: true } // Upsert for new users who logged in via demo
    );

    revalidatePath('/settings');
    return { success: true, message: 'Profile updated successfully' };
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return { success: false, message: error.message || 'Failed to update profile' };
  }
}

/**
 * Handle password changes securely
 */
export async function changePassword(data: any) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      throw new Error('Unauthorized');
    }

    const validated = securitySchema.parse(data);
    await dbConnect();

    const user = await User.findOne({ email: session.email }).select('+password');
    if (!user) throw new Error('User not found');

    // If user has a password set, verify it
    if (user.password) {
      const isValid = await bcrypt.compare(validated.currentPassword, user.password);
      if (!isValid) throw new Error('Incorrect current password');
    }

    // Hash and set new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  } catch (error: any) {
    console.error('Change Password Error:', error);
    return { success: false, message: error.message || 'Failed to change password' };
  }
}

/**
 * Permanently delete user account
 */
export async function deleteAccount() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      throw new Error('Unauthorized');
    }

    await dbConnect();
    await User.findOneAndDelete({ email: session.email });

    // In a real app, you would also clear cookies here
    // But since this is a server action, the frontend handles the redirect
    return { success: true, message: 'Account deleted permanently' };
  } catch (error: any) {
    console.error('Delete Account Error:', error);
    return { success: false, message: 'Failed to delete account' };
  }
}
