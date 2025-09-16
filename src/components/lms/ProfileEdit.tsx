"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  Shield,
  CheckCircle
} from "lucide-react"

interface UserProfile {
  id: number
  name: string
  email: string
  username: string
  displayName: string
  roles: string[]
  avatar_urls?: {
    [key: string]: string
  }
  bio?: string
  phone?: string
  location?: string
  company?: string
  joinDate?: string
}

interface ProfileEditProps {
  user: UserProfile
  onUpdateProfile?: (updatedUser: Partial<UserProfile>) => Promise<void>
  onAvatarUpload?: (file: File) => Promise<string>
}

export function ProfileEdit({ user, onUpdateProfile, onAvatarUpload }: ProfileEditProps) {
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    setFormData({
      name: user.name,
      displayName: user.displayName,
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      company: user.company || ""
    })
  }, [user])

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
    setSuccess("")
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await onUpdateProfile?.(formData)
      setSuccess("Profile updated successfully!")
      setEditMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      displayName: user.displayName,
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      company: user.company || ""
    })
    setEditMode(false)
    setError("")
    setSuccess("")
    setAvatarPreview(null)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setAvatarLoading(true)
    setError("")

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload avatar
      const avatarUrl = await onAvatarUpload?.(file)
      if (avatarUrl) {
        setSuccess("Avatar updated successfully!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar")
      setAvatarPreview(null)
    } finally {
      setAvatarLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "administrator":
        return "destructive"
      case "editor":
        return "default"
      case "author":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Profile Settings
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage 
                    src={avatarPreview || user.avatar_urls?.["96"]} 
                    alt={user.displayName}
                  />
                  <AvatarFallback className="text-lg">
                    {user.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {editMode && (
                  <div className="absolute bottom-2 right-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                        {avatarLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </div>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={avatarLoading}
                    />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {user.displayName}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                @{user.username}
              </p>
            </div>

            <Separator />

            {/* Account Info */}
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
              </div>
              
              {user.joinDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Joined {formatDate(user.joinDate)}
                  </span>
                </div>
              )}

              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 mr-2 text-slate-500" />
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant={getRoleColor(role)} className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              {editMode 
                ? "Update your personal information below"
                : "Your personal information and preferences"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName || ""}
                      onChange={(e) => handleInputChange("displayName", e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company || ""}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-500">Display Name</Label>
                      <p className="text-slate-900 dark:text-slate-100">
                        {user.displayName || "Not set"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-500">Full Name</Label>
                      <p className="text-slate-900 dark:text-slate-100">
                        {user.name || "Not set"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-500">Phone</Label>
                      <p className="text-slate-900 dark:text-slate-100 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-500" />
                        {user.phone || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-500">Location</Label>
                      <p className="text-slate-900 dark:text-slate-100 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                        {user.location || "Not set"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-500">Company</Label>
                      <p className="text-slate-900 dark:text-slate-100 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-slate-500" />
                        {user.company || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                {user.bio && (
                  <div>
                    <Label className="text-sm font-medium text-slate-500">Bio</Label>
                    <p className="text-slate-900 dark:text-slate-100 mt-1 leading-relaxed">
                      {user.bio}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}