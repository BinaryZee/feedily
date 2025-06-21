import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  const supabase = createClient();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0].emailAddress;

    const { data, error } = await supabase
      .from("users")
      .upsert({ clerk_id: userId, email })
      .select();

    if (error || !data || !data.length) {
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);

      if (fetchError || !userData || !userData.length) {
        return res.status(500).json({ error: "User fetch failed" });
      }

      return res.status(200).json({ id: userData[0].id }); 
    }

    return res.status(200).json({ id: data[0].id }); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
