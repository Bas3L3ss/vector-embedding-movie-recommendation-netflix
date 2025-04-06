"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setIsloading(true);
      const supabaseClient = supabase();
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user);
      setIsloading(false);
    };
    fetchUser();
  }, []);
  return { user, isLoading };
};

export default useUser;
