const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 8000; // Backend API port

// Get API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCYWNbM2ZgdDSp9NlFxTgp0Wtwaaw7dyRc";

// Middleware to parse JSON requests
app.use(express.json());

// Add graceful error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep the process running despite the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process running despite the error
});

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('UkBo API is running! Chat with Bo now!');
});

// Handle requests with both English and Spanish parameters
function getMessageFromRequest(req) {
  // For route params
  if (req.params && req.params.message) {
    return req.params.message;
  }
  
  // For query params (support both 'message' and 'mensaje')
  if (req.query) {
    if (req.query.message) {
      return req.query.message;
    }
    if (req.query.mensaje) {
      return req.query.mensaje;
    }
  }
  
  return null;
}

// Common function to handle Gemini API requests
async function getGeminiResponse(userMessage) {
  try {
    // New prompt for Bo character
    const boPrompt = `Actúa como un adolescente llamado Bo del juego de ritmo UkBo (parecido a Friday Night Funkin). Bo es un personaje creado por SoyMaycol. Bo es despreocupado, habla con jerga adolescente, usa muchas expresiones informales y emojis. Es enérgico, bromista y le encanta el ritmo y la música. Responde como Bo a este mensaje: ${userMessage}`;
    
    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: boPrompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the text response from Gemini
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Failed to get proper response structure from Gemini");
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('Gemini API error response:', JSON.stringify(error.response.data).substring(0, 500));
    }
    throw error;
  }
}

// Main endpoint to forward messages to Gemini directly through axios
app.get('/ask/:message', async (req, res) => {
  try {
    const userMessage = getMessageFromRequest(req);
    
    if (!userMessage) {
      return res.status(400).send('¡Yo! Necesito un mensaje para responder. ¡Dime algo!');
    }
    
    console.log(`Processing request for message: ${userMessage}`);
    
    const geminiText = await getGeminiResponse(userMessage);
    console.log(`Sending Bo's response: ${geminiText.substring(0, 50)}...`);
    
    // Return the raw text response
    res.send(geminiText);
  } catch (error) {
    console.error('Error handling request:', error.message);
    res.status(500).send(`¡Ups! Parece que hay un problema con el ritmo... Inténtalo de nuevo. Error: ${error.message}`);
  }
});

// Alternative endpoint that accepts query parameter (supports both 'message' and 'mensaje')
app.get('/ask', async (req, res) => {
  try {
    const userMessage = getMessageFromRequest(req);
    
    if (!userMessage) {
      return res.status(400).send('¡Yo! Necesito un mensaje para responder. ¡Dime algo con el parámetro "message" o "mensaje"!');
    }
    
    console.log(`Processing request for message (query): ${userMessage}`);
    
    const geminiText = await getGeminiResponse(userMessage);
    console.log(`Sending Bo's response: ${geminiText.substring(0, 50)}...`);
    
    // Return the raw text response
    res.send(geminiText);
  } catch (error) {
    console.error('Error handling request:', error.message);
    res.status(500).send(`¡Ups! Parece que hay un problema con el ritmo... Inténtalo de nuevo. Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
