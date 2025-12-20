
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Extendemos la interfaz para incluir la justificación técnica
export interface EnhancedAnalysisResult extends AnalysisResult {
  detectedStrokeJustification: string;
}

const PROMPT_SYSTEM = `Eres un sistema de análisis biomecánico de élite para tenis profesional. 
Tu tarea es analizar una secuencia cronológica de fotogramas y realizar un diagnóstico técnico preciso.

PROTOCOLO DE ANÁLISIS (Sigue estos pasos estrictamente):
1. IDENTIFICACIÓN DE HITOS: Observa cada frame y localiza la raqueta y la bola.
2. CLASIFICACIÓN: 
   - Si la raqueta sube por encima del hombro con el cuerpo perfilado y hay una fase de 'trofeo', es un SAQUE.
   - Si la raqueta describe un arco lateral y hay un giro de hombros (unit turn), es un DRIVE o REVÉS.
3. VALIDACIÓN DE INTENCIÓN: El usuario te dirá qué intentaba hacer. Si ves que es otra cosa, explica por qué (ej: "Aunque indicaste Saque, el movimiento es de Drive porque el impacto es lateral y no sobre la cabeza").
4. EVALUACIÓN: Puntúa basándote en la cadena cinética (transferencia de energía desde los pies hasta la raqueta).

Responde SIEMPRE en formato JSON y en ESPAÑOL.`;

export const analyzeVideoFrames = async (frames: string[], expectedStroke: string): Promise<EnhancedAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const imageParts = frames.map((base64, index) => ({
    inlineData: {
      data: base64.split(',')[1],
      mimeType: 'image/jpeg'
    }
  }));

  const userPrompt = `
    CONTEXTO: El jugador intentaba realizar un: "${expectedStroke}".
    DATOS: Tienes 12 fotogramas ordenados cronológicamente del 1 al 12.
    
    TAREA:
    1. Identifica qué golpe se está ejecutando realmente analizando la trayectoria de la raqueta.
    2. Si no coincide con "${expectedStroke}", sé muy específico explicando por qué en el campo 'detectedStrokeJustification'.
    3. Analiza la técnica (preparación, punto de impacto, terminación).
    4. Genera el scoring técnico.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: {
        parts: [...imageParts, { text: userPrompt }]
      },
      config: {
        systemInstruction: PROMPT_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strokeType: { type: Type.STRING },
            detectedStrokeJustification: { type: Type.STRING, description: "Explicación de por qué se identificó este golpe y no otro" },
            overallScore: { type: Type.NUMBER },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                },
                required: ["label", "score"]
              }
            },
            summary: { type: Type.STRING },
            improvementAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            actionableTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["strokeType", "detectedStrokeJustification", "overallScore", "breakdown", "summary", "improvementAreas", "actionableTips"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as EnhancedAnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error Detail:", error);
    const errorMessage = error.message || JSON.stringify(error);
    throw new Error(`Error técnico: ${errorMessage}. Intenta con otro video.`);
  }
};

export const extractFrames = (videoFile: File, frameCount: number = 12): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(videoFile);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.load();

    video.onloadedmetadata = () => {
      // Centramos la extracción en el 60% central del video donde suele estar la acción
      const start = video.duration * 0.2;
      const end = video.duration * 0.8;
      const range = end - start;
      const interval = range / (frameCount - 1);
      const frames: string[] = [];
      let capturedCount = 0;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onseeked = () => {
        if (!ctx) return;
        // Aumentamos resolución de captura
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg', 0.85)); // Mayor calidad de imagen
        capturedCount++;

        if (capturedCount < frameCount) {
          video.currentTime = start + (interval * capturedCount);
        } else {
          URL.revokeObjectURL(objectUrl);
          resolve(frames);
        }
      };

      video.currentTime = start;
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo procesar el video."));
    };
  });
};
