import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = Fastify()
const prisma = new PrismaClient()

app.register(cors)

app.get('/', () => {
  return 'Hello World'
})

app.listen({
  port: 3000
}).then(() => {
  console.log('🚀 Server running in localhost:3000')
})