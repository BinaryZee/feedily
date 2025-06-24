import { createClient } from "../../utils/supabase";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const supabase = createClient();

  const { title } = req.body;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const response = await fetch(`${baseUrl}/api/getUserDetails`, {
    headers: {
      Cookie: req.headers.cookie || "",
    },
  });
  const resJson = await response.json();
  const { id } = resJson;

  const link = uuidv4();
  const {data , error} = await supabase.from("widgets").insert([{id:id , title ,feedbacks:{} , link , archieved : false,text_feedback:false}]).select().single()
  if(error)console.log(error)
  res.status(200).end(); 
}
