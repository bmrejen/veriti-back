import express from "express";
import { getVulnerabilities } from "./getVulnerabilities.js";
import cors from "cors";

const app = express();
const PORT = 3002;
app.use(cors());

app.get("/v1/vulnerabilities", async (req, res) => {
  const vulnerabilities = await getVulnerabilities();
  res.send({ vulnerabilities });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
