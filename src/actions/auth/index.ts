"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credential = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(credential);

  if (error) {
    throw new Error("Wrong credentials");
  }
}

export async function signup(email: string, password: string) {
  const supabase = await createClient();

  const credential = {
    email,
    password,
  };

  const { error } = await supabase.auth.signUp(credential);

  if (error) {
    console.log(error);
    redirect("/error");
  }
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }

  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/");
  }

  redirect(data.url);
}
