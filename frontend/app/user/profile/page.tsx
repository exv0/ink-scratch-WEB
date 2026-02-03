// app/user/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/services/user.service';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const { user, refreshAuth } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const updateData: { bio: string; profileImage?: File } = { bio };
      if (profileImage) {
        updateData.profileImage = profileImage;
      }

      const result = await userService.updateProfile(user._id, updateData);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update user in cookies
      const currentUser = user;
      const updatedUser = { ...currentUser, ...result.data };
      document.cookie = `user_data=${JSON.stringify(updatedUser)}; path=/`;
      
      refreshAuth();
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: unknown) {
      setMessage({ type: 'error', text: (error as Error).message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Update Profile</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Account Information</h2>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Username:</span> {user.username}</p>
              <p><span className="font-medium">Full Name:</span> {user.fullName}</p>
              <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
              <p><span className="font-medium">Gender:</span> {user.gender}</p>
              <p><span className="font-medium">Role:</span> {user.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              {previewUrl && (
                <div className="mb-4">
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
              />
              <p className="mt-2 text-sm text-gray-500">JPG, JPEG or PNG. Max size 5MB.</p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio (max 160 characters)
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
              <p className="mt-1 text-sm text-gray-500">{bio.length}/160 characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}