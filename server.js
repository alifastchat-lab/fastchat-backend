const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "OK" : "YOX");
console.log("SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "YOX");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// test
(async () => {
  const { data, error } = await supabase.from("users").select("id").limit(1);
  console.log("SUPABASE TEST:", error || data);
})();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("id, username")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true, user: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SERVER STARTED ON PORT", PORT));
