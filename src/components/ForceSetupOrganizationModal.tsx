"use client";

import { useState, useEffect, DragEvent, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import clsx from "clsx";
import { upload } from "@/lib/uploadFile";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { PasswordInput } from "./ui/passwordinput";
import { DialogTitle } from "@radix-ui/react-dialog";

export function ForceSetupOrganizationModal() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const org = session?.user?.organization;

  const [passcode, setPasscode] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ , setDragCounter] = useState(0);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (org && !org.passcode) {
      setModalOpen(true);
    }
  }, [org]);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await upload(file, "organization-logos");
      setLogoUrl(url);
      toast.success("Logo uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragCounter(0);
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async () => {
    if (!passcode || !password) {
      toast.error("Please fill in all fields", {
        position: "top-center"
      });
      return;
    }

    try {
      setSubmitting(true);
      await axios.put("/api/organization/setup", {
        passcode,
        logoUrl,
      });

      toast.success("Organization setup saved. Re-authenticating...", {
        position: "top-center"
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: session?.user.email,
        password,
        role: session?.user.role,
      });

      if (result?.error) {
        toast.error("Failed to refresh session: " + result.error, {
          position: "top-center"
        });
        return;
      }

      await update();
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={modalOpen}>
      <DialogContent
        className={clsx(
          "max-w-md w-full sm:rounded-lg pointer-events-auto transition-all",
          dragging && "border-dashed border-2 border-primary bg-muted"
        )}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragCounter((prev) => prev + 1);
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragCounter((prev) => {
            const newCount = prev - 1;
            if (newCount <= 0) {
              setDragging(false);
              return 0;
            }
            return newCount;
          });
        }}
        onDrop={handleDrop}
        showCloseButton={false}
      >
        <div className="relative">
          {dragging && (
            <div className="absolute w-full h-full grid place-items-center bg-white/60 z-50">
              <div className="flex flex-col justify-center items-center gap-3 text-primary">
                <ImagePlus size={80} />
                <p className="text-center text-2xl font-bold">Drop Here</p>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>
              <h2 className="text-xl font-semibold text-center">
                Setup Your Organization
              </h2>
            </DialogTitle>
            <DialogDescription>
              <p className="text-sm text-muted-foreground text-center">
                To complete this setup, enter your password to re-authenticate
                after saving. Upload your logo and set a passcode employees will
                use to log in.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 mt-5">
            <div className="space-y-2">
              <Label>
                Organization Passcode{" "}
                <span className="text-[0.7rem] text-primary">
                  (required) *
                </span>{" "}
              </Label>
              <PasswordInput
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Set a secure passcode"
              />
            </div>

            <div className="space-y-2">
              <div className="w-full grid gap-2">
                <Label>Organization Logo</Label>
                <input
                  ref={inputRef}
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Choose file to upload
                    </>
                  )}
                </Button>
              </div>

              {logoUrl && (
                <div className="mt-2">
                  <Image
                    src={logoUrl}
                    alt="Logo preview"
                    width={120}
                    height={120}
                    className="rounded"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Or drag and drop your logo image into this dialog.
              </p>
            </div>

            <hr className="mt-7 w-full bg-white/50" />

            <div className="space-y-2 mt-10">
              <Label>Your Account Password</Label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to continue"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save & Continue"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
