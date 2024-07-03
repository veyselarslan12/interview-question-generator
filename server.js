require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const { OpenAI } = require("openai");

const app = express();
const port = 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.static("public"));
app.use(bodyParser.json());

app.post("/generate-questions", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send("Prompt is required.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 120,
      top_p: 1,
    });

    console.log("Response from OPENAI API:", JSON.stringify(response, null, 2));

    if (
      response &&
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      res.json(response.choices[0].message.content);
    } else {
      res.status(500).send("Unexpected response structure from OpenAI API.");
    }
  } catch (error) {
    console.log("Error generating interview questions:", error);
    res
      .status(500)
      .send("An error occurred while generating interview questions.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
