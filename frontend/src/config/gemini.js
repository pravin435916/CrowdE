import { GoogleGenerativeAI } from "@google/generative-ai";

// import dotenv from 'dotenv';
// dotenv.config();
const apiKey = 'AIzaSyCKBILXhi3VRz46bKk9HEWxlAPaG4qR5To' 
// || process.env.VITE_GEMINI_KEY ;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


 export const chatSession = model.startChat({
    generationConfig,
  });