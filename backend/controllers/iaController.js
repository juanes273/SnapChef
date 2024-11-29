const Groq = require("groq-sdk");
const LlamaKey = process.env.LLAMAKEY

const groq = new Groq({ apiKey:  LlamaKey});

module.exports.getGroqChatCompletion = async (req, res) => {
  const details = req.body.content;

  if (!details) {
    return res.status(400).json({ error: "Ingredientes requeridos" });
  }

  try {
    const prompt = `Given the following list of ingredients: ${details}, suggest a set of recipes that can be made using all of these ingredients. Provide the recipe names, ingredients, and step-by-step instructions for each recipe. The recipes should be diverse and suitable for various cooking levels (easy, medium, and hard). Make sure that all ingredients are used in each recipe.`;

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
