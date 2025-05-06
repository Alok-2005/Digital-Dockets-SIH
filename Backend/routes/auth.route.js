import express from 'express'
import { login, logout, signup,checkAuth } from '../controllers/auth.controllers.js'
const router = express.Router()
// router.post("/",home)
router.get("/check-auth",checkAuth)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

export default router