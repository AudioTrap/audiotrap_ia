import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

const OPENAI_KEY = process.env.OPENAI_KEY;

app.post("/responder", async (req, res) => {
  const pergunta = req.body.pergunta;

  try {
    const resposta = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: pergunta }]
    }, {
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ resposta: resposta.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao obter resposta da IA" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
