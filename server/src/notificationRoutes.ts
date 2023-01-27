import WebPush from 'web-push'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const publicKey = 'BNV30VJ0vXzsK2pNR_gWZoq3PvtuauiV_37DpnaLxQUtY6Sz8iSnAp8nlgRNxf-W2HererFOd6lIrLEutABwbJY'
const privateKey = 'qBAIQWzXEWmyzB0ZcoFeUzgqQXIjGrpWX3sB2fd35kg'

WebPush.setVapidDetails(
  'http://localhost:3333',
  publicKey,
  privateKey
)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return { publicKey }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send()
  })

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, 'HELLO DO BACKEND')
    }, 5000)

    return reply.status(201).send()
  })
}