const express = require("express");
const cors = require("cors");
const path = require("path");

const issueRoute = require("./routes/issue");
const verifyRoute = require("./routes/verify");
const ledgerRoute = require("./routes/ledger");

const app = express(); // ✅ app FIRST

app.use(cors());
app.use(express.json());

// ✅ static files AFTER app is created
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/issue", issueRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/ledger", ledgerRoute);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
