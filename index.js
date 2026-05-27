// Set Up config files
import dotenv from "dotenv";
dotenv.config();

// Import modules
import express from "express";
import path from "path";

import { checkEmail } from "./services/mailboxService.js";

const app = express();

const port = process.env.PORT || 3000;
const API_KEY = process.env.MAILBOXLAYER_API_KEY;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// Render Homepage
app.get("/", (req, res) => {
  res.render("index");
});

// POST Request (Email check)
app.post("/check", async (req, res) => {
  const email = req.body.email;

  // Input Validation
  if (!email || email.trim() === "") {
    return res.render("result", {
      email: null,
      data: null,
      error: "Please enter a valid email address",
    });
  }

  // API KEY Validation
  if (!API_KEY) {
    return res.render("result", {
      email: null,
      data: null,
      error: "Server configuration error: missing API KEY",
    });
  }

  try {
    const data = await checkEmail(API_KEY, email);
    res.render("result", { email, data });
  } catch (error) {
    console.error(error.message);
    res.render("result", {
      email,
      data: null,
      error: "Something went wrong while checking this email",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
