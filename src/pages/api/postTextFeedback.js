import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient();
  const { link, user_name, title } = req.body;

  if (!link || !user_name || !title) {
    return res.status(400).json({ error: "Missing link, user_name, or title" });
  }

  try {

    const { data: existingEntry, error: fetchError } = await supabase
      .from("feedbacks")
      .select("feedbacks")
      .eq("link", link)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    let updatedFeedbacks = {};

    if (existingEntry) {
      const existingFeedbacks = existingEntry.feedbacks || {};
      const userFeedbacks = existingFeedbacks[user_name] || [];
      updatedFeedbacks = {
        ...existingFeedbacks,
        [user_name]: [...userFeedbacks, title],
      };
    } else {
      updatedFeedbacks = {
        [user_name]: [title],
      };
    }

    const { data, error: upsertError } = await supabase
      .from("feedbacks")
      .upsert({ link, feedbacks: updatedFeedbacks }, { onConflict: "link" });

    if (upsertError) {
      throw upsertError;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
