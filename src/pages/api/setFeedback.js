import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }


  const supabase = createClient();
  const { set , link } = req.body;

  const { error } = await supabase
    .from("widgets")
    .update({ text_feedback: set })
    .eq("link", link);

  if (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Failed to update feedback" });
  }

  return res.status(200).json({ success: true });
}
