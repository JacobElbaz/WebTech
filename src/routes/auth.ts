import express from 'express'
const router = express.Router()
import auth from '../controllers/auth.js'

router.post('/login', auth.login)

router.post('/register', auth.register)

router.get('/logout', auth.logout)

router.get('/refresh', auth.refresh)

export = router