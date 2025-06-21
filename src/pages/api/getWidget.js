import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createClient();
  const { link } = req.query;

  if (!link) {
    return res.status(400).json({ error: 'Missing link parameter' });
  }

  const { data, error } = await supabase
    .from("widgets")
    .select("title, feedbacks")
    .eq("link", link)
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching widget' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Widget not found' });
  }

  return res.status(200).json(data);
}