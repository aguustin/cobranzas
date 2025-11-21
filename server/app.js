import express, { text, urlencoded } from "express"
import morgan from "morgan"
import cors from "cors"
import { dbConnection } from "./connection.js"
import { port } from "./config.js"

const app = express()
dbConnection()


const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}

//middlewares
app.use(cors(corsOptions))
app.use(express.text())
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(morgan('tiny'))

//routes

//listening
app.listen(() => {
    console.log(`Backend en puerto: ${port}`), port
})