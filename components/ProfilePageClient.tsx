"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload, CheckCircle, User, Mail, Hash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  studentCardUrl: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePageClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentCardUrl: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (response.ok) {
        setProfile(data.data);
        setFormData({
          name: data.data.name,
          email: data.data.email,
          studentCardUrl: data.data.studentCardUrl
        });
      } else {
        toast.error(data.error || "Failed to fetch profile");
      }
    } catch (error) {
      toast.error(`Failed to fetch profile: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await uploadRes.json();
      setFormData(prev => ({ ...prev, studentCardUrl: url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(`Failed to upload image: ${error}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.data);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error(`Failed to update profile: ${error}`);
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center pt-24">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Student ID Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Card Holder/Clip */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-16 h-12 bg-gray-600 rounded-t-lg shadow-lg flex items-end justify-center pb-2">
                  <div className="w-8 h-3 bg-gray-700 rounded-sm"></div>
                </div>
              </div>

              {/* Main Card */}
              <div className="w-80 sm:w-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-400 text-sm font-medium">✓ Verified Student</p>
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {profile.studentCardUrl ? (
                        <img
                          src={profile.studentCardUrl}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {getInitials(profile.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-white text-xl font-bold">{profile.name}</h2>
                      <p className="text-gray-300 text-sm">{profile.email}</p>
                    </div>
                  </div>

                  {/* University Info */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-1">University</p>
                    <h3 className="text-white text-lg font-semibold">Botho University</h3>
                  </div>

                  {/* Student ID */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-1">Student ID</p>
                    <h3 className="text-white text-2xl font-bold tracking-wider">{profile.studentId}</h3>
                  </div>
                </div>

                {/* University Card Section */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">B</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Botho University</h4>
                        <p className="text-teal-100 text-xs">Empowering Dreams, Inspiring Futures</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-teal-200">Student ID: <span className="text-white font-mono">{profile.studentId}</span></p>
                        <p className="text-teal-200">Full Name: <span className="text-white">{profile.name}</span></p>
                        <p className="text-teal-200">Department: <span className="text-white">Computing</span></p>
                      </div>
                      <div className="flex items-center justify-end">
                        <div className="w-16 h-16 bg-white/20 rounded border border-white/30 flex items-center justify-center">
                          <div className="text-white text-xs text-center">
                            <div className="grid grid-cols-4 gap-px">
                              {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-teal-500/30">
                      <p className="text-teal-100 text-xs">
                        University No: +266 2224 7500 | Website: lesotho.bothouniversity.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Student ID (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">
                    Student ID
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="studentId"
                      type="text"
                      value={profile.studentId}
                      className="pl-10 bg-gray-50"
                      disabled
                    />
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Profile Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {uploadingImage ? "Uploading..." : "Click to upload"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          or drag and drop<br />
                          PDF, PNG or JPG (max. 10MB)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Member Since
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formatDate(profile.createdAt)}
                      className="pl-10 bg-gray-50"
                      disabled
                    />
                  </div>
                </div>

                {/* Update Button */}
                <Button
                  type="submit"
                  disabled={updating || uploadingImage}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {updating ? "Updating..." : "Update Info"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}