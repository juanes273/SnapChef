const Groq = require("groq-sdk");
const LlamaKey = process.env.LLAMAKEY

const groq = new Groq({ apiKey:  LlamaKey});

module.exports.translate = async (req, res) => {
  const details = req.body.content;

  if (!details) {
    return res.status(400).json({ error: "Texto requerido" });
  }

  try {
    const prompt = `Translate the following list of food items and ingredients from English to Spanish: ${details} Please provide the translated result in the same format, with each item separated by commas and NO extra explanation, just the result.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gemma2-9b-it",
    });

    console.log(chatCompletion.choices[0]?.message?.content);

    // Send the result back to the client
    res.json({
      content: chatCompletion.choices[0]?.message?.content || "No content available",
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
