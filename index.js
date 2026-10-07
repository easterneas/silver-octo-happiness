// import package-nya si dotenv
import "dotenv/config";

import multer from "multer";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

const app = express();
const upload = multer({
  limits: {
    fileSize: 1_000_000
  }
});
const ai = new GoogleGenAI();

// inisialisasi aplikasi
app
.use(upload.single('file')) // inisialisasi multer dengan single `file` upload
// method chaining
.use(cors())
.use(express.json()) // kita bisa terima header `Content-Type: application/json`

// inisialisasi routes + handler
// endpoint 1: POST /api/generate-text
.post("/api/generate-text", async (req, res) => {
  const { prompt } = req.body;

  // try-catch: kita coba/`try` dulu, kalau error, kita jalanin `catch`-nya
  try {
    const interaction = await ai.interactions.create({
      model: 'gemini-3.1-flash-lite',
      input: prompt,
      system_instruction: ""
    });

    return res.status(200).json({
      success: true,
      message: interaction.output_text
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Wah, ada masalah nih! Developer, tolong cek console log-nya ya!"
    });
  }
})
// endpoint 1: POST /api/process-media
.post("/api/process-media", async (req, res) => {
  const { prompt } = req.body;
  // ambil file dengan req.file.buffer.toString("base64");
  const base64File = req.file?.buffer.toString("base64");

  // tentukan tipe file secara dinamis (image, audio, video, atau document)
  const mimeType = req.file?.mimetype || "";
  let fileType = "document";
  if (mimeType.startsWith("image/")) {
    fileType = "image";
  } else if (mimeType.startsWith("audio/")) {
    fileType = "audio";
  } else if (mimeType.startsWith("video/")) {
    fileType = "video";
  }

  // try-catch: kita coba/`try` dulu, kalau error, kita jalanin `catch`-nya
  try {
    const interaction = await ai.interactions.create({
      model: 'gemini-3.1-flash-lite',
      // kita buat input-nya dalam bentuk array
      input: [
        // untuk type text, nanti kita butuh `text`
        { type: "text", text: prompt },
        // untuk type media (image/audio/video/document), kita butuh `data` dan `mime_type`
        { type: fileType, data: base64File, mime_type: req.file?.mimetype }
      ]
    });

    return res.status(200).json({
      success: true,
      message: interaction.output_text
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Wah, ada masalah nih! Developer, tolong cek console log-nya ya!"
    });
  }
})

// bungkus gan!
.listen(PORT, () => {
  console.log("Bungkus gan, di port", PORT);
});