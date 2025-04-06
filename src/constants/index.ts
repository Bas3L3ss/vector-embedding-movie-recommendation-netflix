import { User } from "@supabase/supabase-js";

const navItems = (user: User | null) =>
  user
    ? [
        { name: "Home", path: "/home" },
        { name: "Films", path: "/film" },
        { name: "My List", path: "/my-list" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Login", path: "/auth/signin" },
      ];

export { navItems };
