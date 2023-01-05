import express, { response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (request, response) => {
  response.status(200).send({
    message: "This is ChatGPT-Ai App",
  });
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (request, response) => {
  try {
    const res = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: request.body.input,
      temperature: 0, //this shows how much accurate is our answer 0 means it only give the correct answer no falsy or similar value
      max_tokens: 4000, //this shows the length of the bot answer
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log("PASSED: ", request.body.input)

    response.status(200).send({
        bot: res.data.choices[0].text
    })
  } catch (error) {
    console.log("FAILED: ", request.body.input)
    console.log(error);
    response.status(500).send(error);
  }
});

app.listen(4000, () => console.log("Server is running on port 4000"));
