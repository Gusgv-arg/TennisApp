import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyD3fjJFal1nKiQXgdy5v5bZckW-XyprRXo";
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Fetching model list...");
        const response = await ai.models.list();

        // Try iterating
        for await (const model of response) {
            console.log(`Name: ${model.name}`);
            console.log(`DisplayName: ${model.displayName}`);
            console.log(`Supported Actions: ${JSON.stringify(model.supportedActions)}`);
            console.log("---");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
