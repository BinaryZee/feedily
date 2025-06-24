import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient();
  const { ip } = req.body;
  
  console.log(ip)

  if (!ip) {
    return res.status(400).json({ error: "Missing IP" });
  }

  const { data, error } = await supabase
    .from("ip")
    .select("ip , user_name",)
    .eq("ip", ip)
    .single(); 
  console.log(data)
  if (error && error.code !== "PGRST116") { 
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database error", details: error });
  }

  const exists = !!data; 
  if(exists)return res.status(200).json({ exists , userName : data.user_name});
  else return res.status(200).json({ exists });
}
