// 1.Création du model Sauce pour un stockage dans la base de données
// 2. Créer une base de données
// 3. Créer une collection

const { default: mongoose } = require("mongoose")

// 4. Créer un schéma
const productSchema = new mongoose.Schema({
    userId: String, 
    name :String, 
    manufacturer: String, 
    description: String, 
    mainPepper: String,
    imageUrl: String, 
    heat: { type: Number, min: 1, max: 10 },
    likes: Number, 
    dislikes: Number, 
    usersLiked: [String],
    usersDisliked: [String]  
})

// le Schéma du produit
// 1. obtenir les Sauces
// 2. renvoyer les Sauces
// 3. renvoyer une erreur
const Product = mongoose.model("Product", productSchema)

module.exports = {productSchema, Product}
