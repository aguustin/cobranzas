import express from "express"
import morgan from "morgan"
import cors from "cors"
import { dbConnection } from "./connection.ts"
import { port } from "./config.ts"
import boxRoutes from "./routes/boxRoutes.ts"
import managerRoutes from "./routes/managerRoutes.ts"
import sellRoutes from "./routes/sellRoutes.ts"
import storeRoutes from "./routes/storeRoutes.ts"
import userRoutes from "./routes/userRoutes.ts"
import productRoutes from "./routes/productRoutes.ts"

const app = express();

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'))

//routes
app.use(boxRoutes)
app.use(managerRoutes)
app.use(sellRoutes)
app.use(storeRoutes)
app.use(userRoutes)
app.use(productRoutes)

//listening
app.listen(port, () => {
    console.log(`Backend en puerto: ${port}`), port
})