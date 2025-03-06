import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { User } from "@supabase/supabase-js";

interface ProfileHeaderProps {
  user: User | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  console.log(user);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 rounded-md">
          <AvatarImage
            src={user?.user_metadata.picture ?? "/placeholder-user.jpg"}
            alt={user?.email || ""}
          />
          <AvatarFallback className="rounded-md bg-red-600 text-2xl">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold text-white">
            {user?.user_metadata.name || "Me"}
          </h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
