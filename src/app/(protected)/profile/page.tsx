import ProfileContainer from "@/components/profile/profile-container";
import ProfileHeader from "@/components/profile/profile-header";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const title = user?.user_metadata.name
    ? `${user?.user_metadata?.name} | Netflix`
    : "Me | Netflix";
  const description = `${user?.user_metadata.name ?? "Me"} profile page`;

  return {
    title,
    description,
    keywords: ["Netflix", "My Profile", "User"],
    alternates: {
      canonical: "https://yourwebsite.com/mylist",
    },
    openGraph: {
      title,
      description,
      url: "https://yourwebsite.com/mylist",
      siteName: "Netflix",
      images: [
        {
          url: "https://yourwebsite.com/og-mylist.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yourwebsite.com/twitter-mylist.jpg"],
    },
  };
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch additional user data if needed
  let userData = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    userData = data;
  }

  return (
    <section>
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Account Profile</h1>
        <ProfileHeader user={user} />
        <ProfileContainer user={user} userData={userData} />
      </div>
    </section>
  );
}
