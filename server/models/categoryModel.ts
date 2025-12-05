import mongoose from "mongoose";
import { CategoryI } from "../interfaces/interfaces.ts";

const CategorySchema = new mongoose.Schema<CategoryI>({
    categoryName:{type: String},
    categoryNumber:{type: Number}
})

const categoryModel = mongoose.model('categoryModel', CategorySchema)

export default categoryModel