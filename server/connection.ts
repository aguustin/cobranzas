import mongoose from "mongoose";
import { mongo_uri } from "./config.js";

const database_connection_uri = mongo_uri

export const dbConnection = async () => {
    try {
       await mongoose.connect(database_connection_uri)
       console.log("Base de datos conectada")
    } catch (error) {
        console.log("No se logro conectar a la base de datos: ", error)
    }
}