"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightLeft, Copy, Check, Clock, RefreshCw } from "lucide-react"
import { translateText } from "@/lib/aws-translate"
import { useToast } from "@/hooks/use-toast"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "hi", name: "Hindi" },
]

interface TranslationHistory {
  sourceLanguage: string
  targetLanguage: string
  sourceText: string
  translatedText: string
  timestamp: Date
}

export default function TranslationService() {
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<TranslationHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("translationHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Convert string timestamps back to Date objects
        setHistory(
          parsedHistory.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      } catch (error) {
        console.error("Failed to parse history:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save history to localStorage
    if (history.length > 0) {
      localStorage.setItem("translationHistory", JSON.stringify(history))
    }
  }, [history])

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Input text is empty",
        description: "Please enter text to translate",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      const result = await translateText(sourceText, sourceLanguage, targetLanguage)
      setTranslatedText(result)

      // Add to history
      const newHistoryItem = {
        sourceLanguage,
        targetLanguage,
        sourceText,
        translatedText: result,
        timestamp: new Date(),
      }

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 20)) // Keep only last 20 translations
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation failed",
        description: "There was an error translating your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Copied to clipboard",
      description: "The translated text has been copied to your clipboard.",
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || code
  }

  const handleHistoryItemClick = (item: TranslationHistory) => {
    setSourceLanguage(item.sourceLanguage)
    setTargetLanguage(item.targetLanguage)
    setSourceText(item.sourceText)
    setTranslatedText(item.translatedText)
    setShowHistory(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-[45%]">
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-shrink-0">
          <Button variant="outline" size="icon" onClick={handleSwapLanguages} className="rounded-full h-10 w-10">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="sr-only">Swap languages</span>
          </Button>
        </div>

        <div className="w-full md:w-[45%]">
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Target Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code} disabled={language.code === sourceLanguage}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Type text to translate..."
            className="min-h-[200px] resize-none"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Translation will appear here..."
              className="min-h-[200px] resize-none"
              value={translatedText}
              readOnly
            />

            {translatedText && (
              <Button variant="outline" size="icon" className="absolute right-2 top-2" onClick={handleCopyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowHistory(!showHistory)}>
          <Clock className="h-4 w-4" />
          {showHistory ? "Hide History" : "Show History"}
        </Button>

        <Button onClick={handleTranslate} disabled={isTranslating} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isTranslating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </div>

      {showHistory && history.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Translation History</h3>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {history.map((item, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700"
                onClick={() => handleHistoryItemClick(item)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>{getLanguageName(item.sourceLanguage)}</span>
                      <ArrowRightLeft className="h-3 w-3" />
                      <span>{getLanguageName(item.targetLanguage)}</span>
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(new Date(item.timestamp))}</div>
                  </div>
                  <p className="text-sm truncate">{item.sourceText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

