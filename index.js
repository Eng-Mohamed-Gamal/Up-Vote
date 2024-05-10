import express from 'express'

import userRouter from './src/modules/User/user.routes.js'
import productRouter from './src/modules/Product/product.routes.js'
import commentRouter from './src/modules/Comment/comment.routes.js'
import likesRouter from './src/modules/Likes/likes.routes.js'
import replyRouter from './src/modules/Reply/reply.routes.js'

import db_connection from './DB/connection.js'
import { config } from 'dotenv'
import { globalResponse } from './src/middlewares/globalResponse.js'

config({ path: './config/dev.config.env' })

const app = express()
const port = process.env.PORT


app.use(express.json())


db_connection()
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/comment', commentRouter)
app.use('/like', likesRouter)
app.use('/reply', replyRouter)

app.use(globalResponse)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

