import { GoogleGenAI } from '@google/genai'
import { GOOGLE_API_KEY } from '../config/env.js'
import { authorize } from '../functions/helperFunctions.js'
import fs from 'fs/promises'

const ai = new GoogleGenAI({ apiKey: String(GOOGLE_API_KEY) })

// -------------------------------------------------------------------------------
// Generate AI content
export async function generate(req, res, next) {
  try {
    // await authorize(req)

    res.set({
      'Content-type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    const multimodal = {
      "gemini-2.5-flash-image": true,
      "gemini-2.5-flash": false
    }

    let model = req.body.model || 'gemini-2.5-flash'
    const history = JSON.parse(req.body.history || '[]')
    
    const message = [{ "text": String(req.body.messageText) }]
    
    for (const file of req.files) {
      const fileDetails = await ai.files.upload({
        file: file.path,
        config: { mimeType: file.mimetype }
      });
      
      message.push({
        "fileData": {
          "fileUri": fileDetails.uri,
          "mimeType": fileDetails.mimeType,
        },
      });
    }

    const chat = ai.chats.create({ 
      model,
      history,
      config: {
        responseModalities: (multimodal[model])? ['TEXT', 'IMAGE']: ['TEXT']
      }
    });

    const stream = await chat.sendMessageStream({ message })

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`)
    }
    res.end()
  } finally {
    await Promise.all(req.files.map(file => fs.unlink(file.path)))
  }
}

export default { generate }
