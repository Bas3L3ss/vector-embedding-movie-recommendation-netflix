"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { Dispatch, SetStateAction } from "react";
import { signout } from "../../actions/auth";
import { passwordFormSchema } from "../../schema";

interface SecuritySettingsProps {
  user: User;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SecuritySettings({
  user,
  isLoading,
  setIsLoading,
}: SecuritySettingsProps) {
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onPasswordSubmit = async (
    values: z.infer<typeof passwordFormSchema>
  ) => {
    setIsLoading(true);
    try {
      const supabaseClient = supabase();
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email: user.email ?? "noemail",
          password: values.currentPassword,
        });

      if (signInError || !signInData.session) {
        throw new Error("Current password is incorrect.");
      }
      const { error } = await supabaseClient.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;

      passwordForm.reset();
      toast("Password updated", {
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Update failed", {
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  console.log(user);

  return (
    <>
      {user.app_metadata.provider !== "google" ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Change Password</CardTitle>
            <CardDescription className="text-gray-400">
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your current password"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  disabled={isLoading}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  disabled={isLoading}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="bg-gray-900 border-gray-800 mt-6">
        <CardHeader>
          <CardTitle className="text-white">Sign Out</CardTitle>
          <CardDescription className="text-gray-400">
            Sign out from your account on this device.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
