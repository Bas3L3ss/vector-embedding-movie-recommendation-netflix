import ProfileContainer from "@/components/profile/profile-container";
import ProfileHeader from "@/components/profile/profile-header";
import { createClient } from "@/lib/supabase/server";
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
        <ProfileHeader user={user} userData={userData} />
        <ProfileContainer user={user} userData={userData} />
      </div>
    </section>
  );
}
