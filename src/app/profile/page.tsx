"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/app/lib/auth-client";
import { uploadToImgBB } from "@/app/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type ProfileFields = {
  name: string;
  phone: string;
  bio: string;
  image: string;
};

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  bio?: string;
};

function ProfileEditor({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileFields>({
    name: user.name ?? "",
    phone: user.phone ?? "",
    bio: user.bio ?? "",
    image: user.image ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function updateField(fieldName: keyof ProfileFields, value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [fieldName]: value,
    }));
  }

  function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    setImagePreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(file);
    });
    setImageFile(file);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = profile.name.trim();
    if (!name) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      let image = profile.image;
      if (imageFile) {
        image = await uploadToImgBB(imageFile);
      }

      const { error } = await authClient.updateUser({
        name,
        image: image || null,
        phone: profile.phone.trim(),
        bio: profile.bio.trim(),
      });
      if (error) {
        toast.error(error.message ?? "Could not update your profile.");
        return;
      }

      setProfile((currentProfile) => ({
        ...currentProfile,
        name,
        phone: profile.phone.trim(),
        bio: profile.bio.trim(),
        image,
      }));
      setImageFile(null);
      await authClient.getSession();
      router.refresh();
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const userInitial =
    profile.name.trim().charAt(0).toUpperCase() || "U";
  const displayedImage = imagePreview || profile.image || undefined;

  return (
    <main className="min-h-[65vh] bg-[#faf8f4] px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1e2a78]">
            Account settings
          </p>
          <h1 className="mt-2 font-(family-name:--font-fraunces) text-3xl font-bold text-[#101535] sm:text-4xl">
            Update profile
          </h1>
        </div>

        <form
          onSubmit={saveProfile}
          className="mt-8 grid gap-8 rounded-3xl border border-[#e3e5f5] bg-white p-6 shadow-sm sm:p-8 md:grid-cols-[180px_minmax(0,1fr)]"
        >
          <div className="flex flex-col items-center">
            <Avatar className="size-32 border-4 border-white shadow-md">
              <AvatarImage src={displayedImage} alt={profile.name || "User"} />
              <AvatarFallback className="bg-[#1e2a78] text-3xl font-bold text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={selectImage}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera aria-hidden="true" />
              {profile.image || imageFile ? "Change photo" : "Add photo"}
            </Button>
            {profile.image && (
              <button
                type="button"
                onClick={() => {
                  if (imagePreview) URL.revokeObjectURL(imagePreview);
                  setImagePreview("");
                  setProfile((currentProfile) => ({
                    ...currentProfile,
                    image: "",
                  }));
                  setImageFile(null);
                }}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="profile-name" className="text-sm font-medium text-[#101535]">
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                maxLength={80}
                value={profile.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] focus:ring-2 focus:ring-[#1e2a78]"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="text-sm font-medium text-[#101535]">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                readOnly
                value={user.email}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
            </div>

            <div>
              <label htmlFor="profile-phone" className="text-sm font-medium text-[#101535]">
                Phone number
              </label>
              <input
                id="profile-phone"
                type="tel"
                maxLength={40}
                value={profile.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+880 1XXXXXXXXX"
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] focus:ring-2 focus:ring-[#1e2a78]"
              />
            </div>

            <div>
              <label htmlFor="profile-bio" className="text-sm font-medium text-[#101535]">
                Bio
              </label>
              <textarea
                id="profile-bio"
                rows={4}
                maxLength={500}
                value={profile.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Tell students or tutors a little about yourself..."
                className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1e2a78] focus:ring-2 focus:ring-[#1e2a78]"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {profile.bio.length}/500
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#1e2a78] px-5 text-white hover:bg-[#161f5c]"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <main className="min-h-[65vh] bg-[#faf8f4] px-6 py-12">
        <p className="mx-auto max-w-3xl text-slate-500">Loading profile...</p>
      </main>
    );
  }

  if (!session?.user) return null;

  const user = session.user as typeof session.user & {
    phone?: string;
    bio?: string;
  };

  return (
    <ProfileEditor
      key={user.id}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        bio: user.bio,
      }}
    />
  );
}
