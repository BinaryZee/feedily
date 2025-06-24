import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: 'Method Not Allowed and having some issue' });
  }

  const supabase = createClient();
  const { ip , userName } = req.body;

  if (!ip || !userName) {
    return res.status(400).json({ error: 'Missing ip or userName' });
  }

  const { data, error } = await supabase
    .from("ip")
    .upsert({ip:ip , user_name:userName},{onConflict:"ip"})

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching widget' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Widget not found' });
  }
  return res.status(200).json(data);
}