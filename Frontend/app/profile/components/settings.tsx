"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/Frontend/lib/supabase";

export default function Settings({ user }: { user: User }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);
  const supabase = createClient();
  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Your Name</Label>
          <Input id="username" placeholder={user.user_metadata.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder={user.email} />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Save Changes</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost">Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your new password below. We recommend using a strong,
                  unique password.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMessage("");
                  const newPassword = (
                    e.target as HTMLFormElement
                  ).elements.namedItem("new-password") as HTMLInputElement;
                  const confirmPassword = (
                    e.target as HTMLFormElement
                  ).elements.namedItem("confirm-password") as HTMLInputElement;
                  if (newPassword.value !== confirmPassword.value) {
                    setSuccessfullyUpdated(false);
                    setMessage("Passwords do not match.");
                    return;
                  }
                  const { error } = await supabase.auth.updateUser({
                    password: newPassword.value,
                  });
                  if (error) {
                    setSuccessfullyUpdated(false);
                    setMessage(error.message);
                    return;
                  }
                  setSuccessfullyUpdated(true);
                  newPassword.value = "";
                  confirmPassword.value = "";
                  setMessage("Password updated successfully.");
                  setTimeout(() => {
                    setMessage("");
                  }, 3000);
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-password" className="text-left">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirm-password" className="text-left">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                {message && successfullyUpdated ? (
                  <p className="text-green-500">{message}</p>
                ) : (
                  <p className="text-red-500">{message}</p>
                )}
                <DialogFooter>
                  <Button type="submit">Change Password</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  );
}
