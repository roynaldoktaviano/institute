"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import axios from "axios";
import { UserData } from "../dashboard/page";
import { getUserData } from "@/lib/api";

interface UserProfile {
  name: string;
  email: string;
  displayName: string;
  bio: string;
  phone: string;
  company: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    displayName: "",
    bio: "",
    phone: "",
    company: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [usern, setUsern] = useState<UserData | null>(null);

  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview sementara
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const token = localStorage.getItem("lms_token");

      if (!token) {
        throw new Error(
          "Token tidak ditemukan, silakan login terlebih dahulu."
        );
      }
      const res = await axios.post(
        `https://roynaldkalele.com/wp-json/custom-user/v1/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // jika kamu pakai JWT auth
          },
        }
      );

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated.",
      });

      // Update avatar URL di frontend
      setAvatarPreview(res.data.avatar_url);
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        console.log("User:", userData);
        setUsern(userData); // misal kamu punya state
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load profile data
    setProfile({
      name: user.name,
      email: user.email,
      displayName: user.name,
      bio: "",
      phone: "",
      company: "",
    });
  }, [user, router]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        displayName: user.name,
        bio: "",
        phone: "",
        company: "",
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile
              </h1>
            </div>

            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative w-fit mx-auto">
                  <Avatar className="h-24 w-24 mx-auto mb-4 cursor-pointer group">
                    <AvatarImage
                      src={
                        avatarPreview ||
                        user.custom_avatar ||
                        user.avatar_urls?.["96"]
                      }
                      alt={user.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>

                    {/* Overlay edit icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Edit className="text-white h-6 w-6" />
                    </div>
                  </Avatar>

                  {/* Hidden input file */}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </div>

                <CardTitle>{profile.displayName}</CardTitle>
                <CardDescription>{usern?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Member since</span>
                    <span className="text-xs">{usern?.registered_date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Level</span>
                    <span className="text-xs">{usern?.level_name}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        <div className="text-lg font-semibold">0</div>
                        <div className="text-xs text-gray-500">Quizzes</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        <div className="text-lg font-semibold">0</div>
                        <div className="text-xs text-gray-500">Trainings</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Edit your profile information"
                    : "View your profile information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={profile.displayName}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            displayName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{profile.displayName}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={usern?.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{usern?.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded min-h-[80px]">
                      <span className={profile.bio ? "" : "text-gray-500"}>
                        {profile.bio || "No bio provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
