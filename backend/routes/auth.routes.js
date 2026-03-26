import { Router } from 'express'
import { signUp, signIn, signOut } from '../controllers/auth.controllers.js'

const authRouter = Router()

authRouter.post('/sign-up', signUp)
authRouter.put('/sign-in', signIn)
authRouter.get('/sign-out', signOut)

export default authRouter