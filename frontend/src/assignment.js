const { generateText } = require("ai");
const { openai } = require("@ai-sdk/openai");
const fs = require("fs");
const axios = require("axios");
const pdfkit = require("pdfkit");

// List of 50 Python programming questions
const questions = [
  "Explain the difference between the list, tuple , set and dictionary ?",
];

// Function to interact with ChatGPT
async function generateSolution(question) {
  try {
    // example.ts
    const messages = [{ role: "user", content: "Hello" }];

    // Get a language model
      const model = openai("gpt-3.5-turbo", {
        
    });

    // Call the language model with the prompt
    const result = await generateText({
      model,
      messages,
      maxTokens: 500,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 1,
      presencePenalty: 1,
    });

    const response = result.text;
    console.log(result.text);

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0
    ) {
      return response.data.choices[0].text.trim(); // Extract text from completion
    } else {
      console.error("No response or empty response from ChatGPT");
      return null;
    }
  } catch (error) {
    console.error("Error interacting with ChatGPT:", error);
    return null;
  }
}

// Function to write to a file
function writeToTextFile(questionsAndSolutions) {
  const filePath = "questions_and_solutions.txt";
  const stream = fs.createWriteStream(filePath);

  questionsAndSolutions.forEach(({ question, solution }) => {
    stream.write(`Question:\n${question}\n\nSolution:\n${solution}\n\n`);
  });

  stream.end();
  console.log(`Questions and solutions written to ${filePath}`);
}

// Function to convert text file to PDF
function convertToPDF() {
  const doc = new pdfkit();
  doc.pipe(fs.createWriteStream("questions_and_solutions.pdf"));

  const content = fs.readFileSync("questions_and_solutions.txt", "utf-8");
  doc.text(content);

  doc.end();
  console.log("PDF generated successfully");
}

// Main function
async function main() {
  const questionsAndSolutions = [];
  for (const question of questions) {
    const solution = await generateSolution(question);
    questionsAndSolutions.push({ question, solution });
  }

  writeToTextFile(questionsAndSolutions);
  convertToPDF();
}

main().catch(console.error);
