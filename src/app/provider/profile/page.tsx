"use client";

import { AlertTriangle, Camera, Edit3, Mail, Save, Send, Trash2, Upload, User as UserIcon, X } from "lucide-react";
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
  useDeleteProviderAccount,
  useProviderProfile,
  useResendVerificationEmail,
  useUpdateProviderProfile,
} from "@/hooks/use-providers";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Provider } from "@/services/providers";
import { useAuthStore } from "@/store/auth-store";
import { uploadImage, getFullImageUrl } from "@/services/uploads";

interface ProviderEditFormProps {
  initialProfile: Provider | null;
  onCancel: () => void;
  onSuccess: (updated: Provider) => void;
}

function ProviderEditForm({ initialProfile, onCancel, onSuccess }: ProviderEditFormProps) {
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProviderMutation = useUpdateProviderProfile();

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
      toast.error("Provider name cannot be empty");
      return;
    }

    try {
      const updatedUser = await updateProviderMutation.mutateAsync({
        name: name.trim(),
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

      onSuccess(updatedUser);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update provider profile"));
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
                {name ? name.charAt(0).toUpperCase() : "P"}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Provider Logo / Photo</p>
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
          <Label htmlFor="provider-name">Business / Provider name</Label>
          <Input
            id="provider-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Electrical Services or Your Name"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="provider-email">Identifier / Email (read-only)</Label>
            <Input
              id="provider-email"
              type="email"
              value={initialProfile?.email ?? ""}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider-phone">Customer contact phone</Label>
            <Input
              id="provider-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
            />
            <p className="text-[11px] text-muted-foreground">
              Displayed to customers on your service listings for rapid coordination.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-bio">Provider bio & experience</Label>
          <Textarea
            id="provider-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Highlight your experience, certifications, working hours, and specialties (e.g. 10+ years in residential electrical repairs, licensed contractor)..."
          />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
        <Button type="submit" size="sm" disabled={updateProviderMutation.isPending}>
          <Save className="mr-1.5 size-3.5" aria-hidden="true" />
          {updateProviderMutation.isPending ? "Saving changes…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={updateProviderMutation.isPending}
          onClick={onCancel}
        >
          <X className="mr-1.5 size-3.5" aria-hidden="true" />
          Cancel
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ProviderProfilePage() {
  const router = useRouter();
  const { resolvedRole, user, updateUser, logout } = useAuthStore();
  const profileQuery = useProviderProfile();
  const deleteProviderMutation = useDeleteProviderAccount();
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

  function handleProfileUpdated(updatedUser: Provider) {
    updateUser({
      name: updatedUser.name,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
    toast.success("Provider profile updated successfully!");
    setIsEditing(false);
  }

  async function handleDeleteAccount() {
    try {
      await deleteProviderMutation.mutateAsync();
      toast.success("Your provider account has been deactivated successfully.");
      logout();
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to deactivate provider account"));
    }
  }

  const currentProfile = profileQuery.data ?? (user ? ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    role: "provider" as const,
    is_active: true,
    is_verified: user.is_verified ?? true,
  }) : null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider profile"
        description="Manage your business information and provider contact details."
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
                  You must verify your email before publishing new services or managing bookings.
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

      {/* Provider Details & Edit Form Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Provider Business Profile</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your public provider details shown to customers on service listings."
                : "Public business information associated with your service provider listing."}
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
          <ProviderEditForm
            initialProfile={currentProfile}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleProfileUpdated}
          />
        ) : (
          <CardContent className="space-y-6 text-sm">
            {/* Provider Avatar Display */}
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
                    {currentProfile?.name ? currentProfile.name.charAt(0).toUpperCase() : "P"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {currentProfile?.name ?? "Provider"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {currentProfile?.email ?? resolvedRole?.subject ?? "Unknown"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
              <div>
                <p className="text-muted-foreground">Provider name</p>
                <p className="mt-1 font-medium">{currentProfile?.name ?? "Provider"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Identifier / Email</p>
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
                  <Badge variant="default" className="capitalize">
                    {resolvedRole?.jwtRole ?? user?.role ?? "provider"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
              <div>
                <p className="text-muted-foreground">Contact phone number</p>
                <p className="mt-1 font-medium text-foreground">
                  {currentProfile?.phone ? `+91 ${currentProfile.phone}` : "Not provided"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">About / Qualifications</p>
                <p className="mt-1 font-medium text-foreground">
                  {currentProfile?.bio || "No description provided yet. Click 'Edit Profile' to add your business details."}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Danger Zone: Provider Account Deactivation */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently deactivate your provider account and delist services.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deactivating your provider account will disable your account and immediately hide all your services from customer search and explore pages.
          </p>

          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 size-4" aria-hidden="true" />
              Deactivate my provider account
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-destructive/40 bg-background p-4">
              <p className="text-sm font-semibold text-destructive">
                Are you sure you want to deactivate your provider account?
              </p>
              <p className="text-xs text-muted-foreground">
                All your active service listings will be removed from search and explore immediately. You will be signed out.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleteProviderMutation.isPending}
                  onClick={handleDeleteAccount}
                >
                  {deleteProviderMutation.isPending ? "Deactivating…" : "Yes, deactivate my account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleteProviderMutation.isPending}
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
