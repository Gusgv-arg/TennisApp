import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyD3fjJFal1nKiQXgdy5v5bZckW-XyprRXo";
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Listing models...");
        const response = await ai.models.list();
        // The response might be an async iterable or an object depending on the SDK version
        // but the new SDK usually returns a list or a paginated response.
        // Let's try to JSON stringify whatever we get, or iterate.

        // Check if it has a models property
        if (response) {
            console.log(JSON.stringify(response, null, 2));
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
