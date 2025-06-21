import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const supabase = createClient();

  try {
    // Get user details from internal API
    const response = await fetch(`${baseUrl}/api/getUserDetails`, {
      headers: {
        Cookie: req.headers.cookie || "",
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resJson = await response.json();
    const { id } = resJson;

    const { data, error } = await supabase
      .from("widgets")
      .select("*")
      .eq("id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: "Database error" });
    }

    // Return data or empty array
    return res.status(200).json(data || []);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
