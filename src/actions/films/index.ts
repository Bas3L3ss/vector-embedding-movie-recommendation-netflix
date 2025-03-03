// use prisma instead

export async function getFilms() {
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .order("created_at", { ascending: false });

  return films || [];
}

export async function getFilmsByType(type: string) {
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  return films || [];
}

export async function getFeaturedFilm() {
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .limit(1)
    .single();

  return films;
}
