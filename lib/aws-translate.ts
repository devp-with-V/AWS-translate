import { Translate } from "@aws-sdk/client-translate"

// Function to translate text using AWS Translate
export async function translateText(text: string, sourceLanguage: string, targetLanguage: string) {
  // For client-side usage, we'll call our server API endpoint
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Translation failed")
    }

    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error("Translation error:", error)
    throw error
  }
}

// Server-side AWS Translate setup (used only in the API route)
export const getTranslateClient = () => {
  // AWS credentials configuration should be done through environment variables
  // in a production environment
  return new Translate({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}

