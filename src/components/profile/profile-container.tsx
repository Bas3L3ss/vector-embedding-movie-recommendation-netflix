"use client";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import ProfileForm from "./profile-form";
import type { User } from "@supabase/supabase-js";
import SecuritySettings from "./security-setting";

interface ProfileContainerProps {
  user: User | null;
  userData: any;
}

export default function ProfileContainer({
  user,
  userData,
}: ProfileContainerProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 size={24} className="animate-spin text-netflix-red" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="bg-gray-900">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileForm
          user={user}
          userData={userData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </TabsContent>

      <TabsContent value="security">
        <SecuritySettings
          user={user}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
