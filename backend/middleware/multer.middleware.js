import multer from "multer"
import path from "path"
import os from "os"
import fs from 'fs'

const serverTempDir = path.join(os.tmpdir(), 'EienzenAI')
if (!fs.existsSync(serverTempDir)) fs.mkdirSync(serverTempDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, serverTempDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  },
})

export const upload = multer({ storage })