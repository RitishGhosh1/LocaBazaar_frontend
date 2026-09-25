"use client";

import { AlertTriangle, Briefcase, Camera, Edit3, Mail, Save, Send, Trash2, Upload, User as UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCustomerProfile,
  useDeleteCustomerAccount,
  useResendVerificationEmail,
  useUpdateCustomerProfile,
} from "@/hooks/use-customers";
import { useBecomeProvider } from "@/hooks/use-providers";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CustomerRead } from "@/services/customers";
import { useAuthStore } from "@/store/auth-store";
import { uploadImage, getFullImageUrl } from "@/services/uploads";

interface CustomerEditFormProps {
  initialProfile: CustomerRead | null;
  onCancel: () => void;
  onSuccess: (updated: CustomerRead) => void;
}

function CustomerEditForm({ initialProfile, onCancel, onSuccess }: CustomerEditFormProps) {
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileMutation = useUpdateCustomerProfile();

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadImage(file);
      setAvatarUrl(res.url);
      toast.success("Profile photo uploaded!");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to upload photo"));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      const updatedUser = await updateProfileMutation.mutateAsync({
        name: name.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

      onSuccess(updatedUser);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile"));
    }
  }

  return (
    <form onSubmit={handleSaveProfile}>
      <CardContent className="space-y-4 pt-4">
        {/* Avatar Photo Picker */}
        <div className="flex items-center gap-4 pb-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />
          <div className="relative size-16 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
            {avatarUrl ? (
              <img
                src={getFullImageUrl(avatarUrl)!}
                alt="Profile avatar"
                className="size-full object-cover"
              />
            ) : (
              <div className="size-full grid place-items-center bg-primary/10 text-primary text-xl font-bold">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Profile Avatar</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="mr-1.5 size-3.5" />
                {isUploading ? "Uploading…" : "Upload photo"}
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => setAvatarUrl("")}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-name">Full name</Label>
          <Input
            id="customer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email address (read-only)</Label>
            <Input
              id="customer-email"
              type="email"
              value={initialProfile?.email ?? ""}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone number</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-bio">Bio / About you</Label>
          <Textarea
            id="customer-bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell local providers a bit about yourself or your service preferences..."
          />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
        <Button type="submit" size="sm" disabled={updateProfileMutation.isPending || isUploading}>
          <Save className="mr-1.5 size-3.5" aria-hidden="true" />
          {updateProfileMutation.isPending ? "Saving changes…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={updateProfileMutation.isPending}
          onClick={onCancel}
        >
          <X className="mr-1.5 size-3.5" aria-hidden="true" />
          Cancel
        </Button>
      </CardFooter>
    </form>
  );
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const { resolvedRole, user, accessToken, setSession, updateUser, logout } = useAuthStore();
  const becomeProviderMutation = useBecomeProvider();
  const deleteCustomerMutation = useDeleteCustomerAccount();
  const profileQuery = useCustomerProfile();
  const resendVerificationMutation = useResendVerificationEmail();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleResendVerification() {
    try {
      await resendVerificationMutation.mutateAsync();
      toast.success("Verification email queued! Please check your inbox.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to send verification email"));
    }
  }

  function handleProfileUpdated(updatedUser: CustomerRead) {
    updateUser({
      name: updatedUser.name,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  }

  async function handleBecomeProvider() {
    try {
      const updatedUser = await becomeProviderMutation.mutateAsync();
      if (accessToken) {
        setSession(accessToken, {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          is_superuser: false,
        });
      }
      toast.success("Congratulations! You are now a registered Provider.");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upgrade to Provider account"));
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteCustomerMutation.mutateAsync();
      toast.success("Your account has been deactivated successfully.");
      logout();
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to deactivate account"));
    }
  }

  const isProvider = resolvedRole?.jwtRole === "provider" || user?.role === "provider";
  const currentProfile = profileQuery.data ?? (user ? ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    role: "customer" as const,
    is_active: true,
    is_verified: user.is_verified ?? true,
  }) : null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Account details and settings."
      />

      {/* Unverified Email Warning Banner with Resend Button */}
      {currentProfile && !currentProfile.is_verified && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Mail className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Email Verification Pending
                </p>
                <p className="text-xs text-muted-foreground">
                  You can browse all services freely. Verify your email to submit bookings.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 border-amber-500/40 text-amber-800 hover:bg-amber-500/10 dark:text-amber-300"
              disabled={resendVerificationMutation.isPending}
              onClick={handleResendVerification}
            >
              <Send className="mr-1.5 size-3.5" />
              {resendVerificationMutation.isPending ? "Sending email…" : "Resend verification email"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account Details & Edit Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              {isEditing ? "Update your personal details below." : "Personal information associated with your account."}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="mr-1.5 size-3.5" aria-hidden="true" />
              Edit Profile
            </Button>
          )}
        </CardHeader>

        {isEditing ? (
          <CustomerEditForm
            initialProfile={currentProfile}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleProfileUpdated}
          />
        ) : (
          <CardContent className="space-y-6 text-sm">
            {/* User Avatar Display */}
            <div className="flex items-center gap-4">
              <div className="relative size-16 shrink-0 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shadow-sm">
                {currentProfile?.avatar_url ? (
                  <img
                    src={getFullImageUrl(currentProfile.avatar_url)!}
                    alt={currentProfile.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full grid place-items-center bg-primary/10 text-primary text-xl font-bold">
                    {currentProfile?.name ? currentProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {currentProfile?.name ?? "Customer User"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {currentProfile?.email ?? resolvedRole?.subject ?? "Unknown"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
              <div>
                <p className="text-muted-foreground">Full name</p>
                <p className="mt-1 font-medium">{currentProfile?.name ?? "Customer User"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email address</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                  <span>{currentProfile?.email ?? resolvedRole?.subject ?? "Unknown"}</span>
                  {currentProfile?.is_verified ? (
                    <Badge variant="success" className="text-[10px]">Verified</Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px]">Unverified</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Account role</p>
                <div className="mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {resolvedRole?.jwtRole ?? user?.role ?? "customer"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
              <div>
                <p className="text-muted-foreground">Phone number</p>
                <p className="mt-1 font-medium text-foreground">
                  {currentProfile?.phone ? `+91 ${currentProfile.phone}` : "Not provided"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Bio / About</p>
                <p className="mt-1 font-medium text-foreground">
                  {currentProfile?.bio || "No bio added yet. Click 'Edit Profile' to introduce yourself."}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Become a Local Service Provider</CardTitle>
              <CardDescription>
                Offer your expertise, list services, and manage customer bookings on LocaBazaar.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isProvider ? (
            <p className="text-sm text-muted-foreground">
              You are already a registered Provider.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upgrade your current account role to <strong>Provider</strong> instantly with one click.
              </p>
              <Button
                type="button"
                disabled={becomeProviderMutation.isPending}
                onClick={handleBecomeProvider}
              >
                <Briefcase className="mr-2 size-4" aria-hidden="true" />
                {becomeProviderMutation.isPending ? "Upgrading account…" : "Become a Provider"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone: Account Deactivation */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently deactivate your customer account and access.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deactivating your account will prevent you from signing in, hide your profile, and cancel any pending booking requests.
          </p>

          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 size-4" aria-hidden="true" />
              Deactivate my account
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-destructive/40 bg-background p-4">
              <p className="text-sm font-semibold text-destructive">
                Are you sure you want to deactivate your account?
              </p>
              <p className="text-xs text-muted-foreground">
                This action is immediate. You will be signed out and unable to log in until reactivated by an administrator.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleteCustomerMutation.isPending}
                  onClick={handleDeleteAccount}
                >
                  {deleteCustomerMutation.isPending ? "Deactivating…" : "Yes, deactivate my account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleteCustomerMutation.isPending}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
