import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_KEY;

app.get("/", (req, res) => {
  res.send("Backend da Sonora está online ✅");
});

app.post("/responder", async (req, res) => {
  const pergunta = req.body.pergunta;
  console.log("Pergunta recebida:", pergunta);
  console.log("OPENAI_KEY:", OPENAI_KEY ? "OK" : "NÃO DEFINIDA");

  if (!pergunta) {
    return res.status(400).json({ erro: "Pergunta não informada" });
  }

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

    console.log("Resposta da OpenAI:", resposta.data.choices[0].message.content);
    res.json({ resposta: resposta.data.choices[0].message.content });

  } catch (err) {
    console.error("Erro na requisição OpenAI:", err.response?.data || err.message || err);
    res.status(500).json({ erro: "Erro ao obter resposta da IA", detalhes: err.response?.data || err.message });
  }
});

app.listen(3000, "0.0.0.0", () => console.log("Servidor rodando na porta 3000"));
