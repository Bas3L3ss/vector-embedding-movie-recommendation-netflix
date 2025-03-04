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
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { profileFormSchema } from "../../app/schema";

interface ProfileFormProps {
  user: User;
  userData: any;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileForm({
  user,
  userData,
  isLoading,
  setIsLoading,
}: ProfileFormProps) {
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (userData) {
      profileForm.setValue("name", userData.name || "");
    }
    if (user) {
      profileForm.setValue("email", user.email || "");
    }
  }, [userData, user, profileForm]);

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);
    try {
      const supabaseClient = supabase();
      const { error } = await supabaseClient
        .from("users")
        .update({ name: values.name })
        .eq("id", user.id);

      if (error) throw error;

      toast("Profile updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed", {
        description: "There was an error updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Profile Information</CardTitle>
        <CardDescription className="text-gray-400">
          Update your account profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <FormField
              control={profileForm.control}
              disabled={isLoading}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      className="bg-gray-800 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              disabled={true} // Email is read-only
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-700 text-white opacity-70"
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
