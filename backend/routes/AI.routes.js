import { Router } from 'express'
import { generate } from '../controllers/AI.controllers.js'
import { upload } from '../middleware/multer.middleware.js'

const AIRouter = Router();

AIRouter.post('', upload.array("files", 10), generate)

export default AIRouter