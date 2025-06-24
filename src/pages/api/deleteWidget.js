import { createClient } from "../../utils/supabase";

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const supabase = createClient()
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ message: 'Link is required' });
  }

  const { error } = await supabase
    .from('widgets')
    .delete()
    .eq('link', link);

  if (error) {
    return res.status(500).json({ message: 'Failed to delete', error });
  }

  res.status(200).json({ message: 'Deleted successfully' });
}
