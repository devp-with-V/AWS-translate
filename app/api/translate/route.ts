import { type NextRequest, NextResponse } from "next/server"
import { getTranslateClient } from "@/lib/aws-translate"
import { TranslateTextCommand } from "@aws-sdk/client-translate"

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const translateClient = getTranslateClient()

    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLanguage,
      TargetLanguageCode: targetLanguage,
    })

    const response = await translateClient.send(command)

    return NextResponse.json({
      translatedText: response.TranslatedText,
    })
  } catch (error) {
    console.error("Translation API error:", error)

    return NextResponse.json({ error: "Failed to translate text", message: (error as Error).message }, { status: 500 })
  }
}

