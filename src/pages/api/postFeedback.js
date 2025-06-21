import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient();
  const { ip, rating, link } = req.body;

  if (!ip || !rating || !link) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // Step 1: Get the widget row by link
  const { data: widget, error: fetchError } = await supabase
    .from("widgets")
    .select("feedbacks")
    .eq("link", link)
    .single();

  if (fetchError || !widget) {
    return res.status(404).json({ error: "Widget not found" });
  }

  // Step 2: Update the feedbacks JSONB
  const updatedFeedbacks = {
    ...(widget.feedbacks || {}),
    [ip]: rating.toString(),
  };

  const { error: updateError } = await supabase
    .from("widgets")
    .update({ feedbacks: updatedFeedbacks })
    .eq("link", link);

  if (updateError) {
    console.error("Supabase update error:", updateError);
    return res.status(500).json({ error: "Failed to update feedback" });
  }

  return res.status(200).json({ success: true });
}
