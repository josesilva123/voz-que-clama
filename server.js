require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());

app.use(express.static(__dirname));
app.post('/api/perguntar', async (req, res) => {
    const pergunta = req.body.pergunta || '';

    if (!pergunta.trim()) {
        return res.status(400).json({ erro: 'Digite uma pergunta.' });
    }

    try {
        const prompt = `Você é um assistente de estudos teológicos cristãos. Responda de forma clara, respeitosa e fundamentada nas Escrituras. Pergunta do usuário: ${pergunta}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
        });

        const respostaTexto = response.text;
        res.json({ resposta: respostaTexto });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao consultar a IA. Tente novamente.' });
    }
});

app.listen(PORT, () => console.log(`Servidor funcionando em http://localhost:${PORT}`));