import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { User } from "@supabase/supabase-js";
import { Badge } from "../ui/badge";
import { redirect } from "next/navigation";

interface ProfileHeaderProps {
  user: User | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  async function handleAdminRedirect() {
    "use server";
    redirect("/data");
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 rounded-md">
          <AvatarImage
            src={user?.user_metadata?.picture ?? "/placeholder-user.jpg"}
            alt={user?.email || ""}
          />
          <AvatarFallback className="rounded-md bg-red-600 text-2xl">
            {user?.user_metadata.name?.[0].toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold text-white">
            {user?.user_metadata.name || "Me"}
            {"  "}
            {user?.id == process.env.ADMIN_ID ? (
              <form action={handleAdminRedirect} className="inline ml-2">
                <button>
                  <Badge variant={"secondary"}>Admin</Badge>
                </button>
              </form>
            ) : null}
          </h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
