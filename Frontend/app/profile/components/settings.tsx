"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User, UpdateProfileData, ChangePasswordData } from "@/types";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import {
  Loader2,
  UserIcon,
  Mail,
  Camera,
  Lock,
  Save,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
  User2,
  Calendar,
  Globe,
} from "lucide-react";

export default function Settings({ user }: { user: User | null }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateProfilePicture = (url: string) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Profile form handlers
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileMessage(null); // Clear message when user types
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage(null);

    // Validation
    if (!profileData.name.trim()) {
      setProfileMessage({ type: "error", text: "Name is required" });
      setIsProfileLoading(false);
      return;
    }

    if (
      profileData.profilePicture &&
      !validateProfilePicture(profileData.profilePicture)
    ) {
      setProfileMessage({
        type: "error",
        text: "Please enter a valid URL for profile picture",
      });
      setIsProfileLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/profile/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser));
      setProfileMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileMessage({
        type: "error",
        text: "Something went wrong.",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Password form handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordMessage(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMessage(null);

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "Current password is required",
      });
      setIsPasswordLoading(false);
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters long",
      });
      setIsPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      setIsPasswordLoading(false);
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      setIsPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/change-password/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close dialog after successful password change
      setTimeout(() => {
        setIsDialogOpen(false);
        setPasswordMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({
        type: "error",
        text: "Something went wrong.",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center">
            <Lock className="h-12 w-12 text-secondary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-sm">🔐</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Access Denied
          </h3>
          <p className="text-muted-foreground max-w-md">
            You must be logged in to access your account settings. Please sign
            in to continue.
          </p>
        </div>
        <Button asChild className="mt-4">
          <a href="/login">
            <Lock className="h-4 w-4 mr-2" />
            Sign In
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Profile Settings */}
      <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and how others see you
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Globe className="h-3 w-3 mr-1" />
              Public
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Enhanced Profile Picture Preview */}
            <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg border">
              <div className="relative group/avatar">
                <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                  <AvatarImage
                    src={profileData.profilePicture || "/placeholder.svg"}
                    alt={profileData.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {getInitials(profileData.name || user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">
                    {profileData.name || user.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    <Mail className="h-3 w-3 mr-1" />
                    {user.email}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is how you will appear to other users on the platform
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Member since{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <UserIcon className="h-4 w-4 text-primary" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  className="h-11 bg-card border-border focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 bg-muted border-border text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="profilePicture"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Camera className="h-4 w-4 text-primary" />
                Profile Picture URL
              </Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="url"
                placeholder="https://example.com/your-avatar.jpg"
                value={profileData.profilePicture}
                onChange={handleProfileChange}
                className="h-11 bg-card border-border focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little about yourself..."
                value={profileData.bio}
                onChange={handleProfileChange}
                rows={4}
                className="resize-none bg-card border-border focus:border-primary focus:ring-primary/20"
                maxLength={500}
              />

              <Badge variant="outline" className="text-xs">
                {profileData.bio.length}/500
              </Badge>
            </div>

            {profileMessage && (
              <Alert
                variant={
                  profileMessage.type === "error" ? "destructive" : "default"
                }
                className="border-0 shadow-md"
              >
                {profileMessage.type === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertDescription className="font-medium">
                  {profileMessage.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isProfileLoading}
                className="flex items-center gap-2 px-6 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isProfileLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isProfileLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-xl">Security & Privacy</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Lock className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg border group/password hover:shadow-md transition-all duration-200">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">Password</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Last changed:{" "}
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep your account secure with a strong password
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-card hover:bg-muted border-border hover:border-primary/50 group-hover/password:shadow-sm transition-all duration-200"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-card">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl">
                          Change Password
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          Enter your current password and choose a new one. Make
                          sure it is strong and unique.
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-medium"
                      >
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="h-11 pr-12 bg-card border-border focus:border-primary focus:ring-primary/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="h-11 pr-12 bg-card border-border focus:border-primary focus:ring-primary/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="h-11 pr-12 bg-card border-border focus:border-primary focus:ring-primary/20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {passwordMessage && (
                      <Alert
                        variant={
                          passwordMessage.type === "error"
                            ? "destructive"
                            : "default"
                        }
                        className="border-0 shadow-md"
                      >
                        {passwordMessage.type === "error" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <AlertDescription className="font-medium">
                          {passwordMessage.text}
                        </AlertDescription>
                      </Alert>
                    )}

                    <DialogFooter className="gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isPasswordLoading}
                        className="px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPasswordLoading}
                        className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isPasswordLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
