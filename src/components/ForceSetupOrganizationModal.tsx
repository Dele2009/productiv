"use client";

import { useState, useEffect, DragEvent } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import clsx from "clsx";

export function ForceSetupOrganizationModal() {
  const { data: session } = useSession();
  const org = session?.user?.organization;

  const [passcode, setPasscode] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (org && !org.passcode) {
      setModalOpen(true);
    }
  }, [org]);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setLogoUrl(url);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      toast.error("Upload failed");
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
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async () => {
    if (!passcode || !logoUrl) {
      toast.error("Please provide all fields");
      return;
    }

    try {
      setSubmitting(true);
      await axios.put("/api/organization/setup", {
        passcode,
        logoUrl,
      });

      toast.success("Organization setup completed");
      window.location.reload(); // refresh to rehydrate session
    } catch (err) {
      toast.error("Failed to save settings");
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
        onInteractOutside={(e) => e.preventDefault()} // ⛔ prevent backdrop close
        onEscapeKeyDown={(e) => e.preventDefault()} // ⛔ prevent escape key close
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-4 py-2">
          <h2 className="text-xl font-semibold text-center">
            Setup Your Organization
          </h2>

          <div className="space-y-2">
            <Label>Organization Passcode</Label>
            <Input
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Set a secure passcode"
            />
          </div>

          <div className="space-y-2">
            <Label>Organization Logo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
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
              Or drag and drop image into this dialog.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="w-full"
          >
            Save & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
