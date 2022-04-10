const uniqueValidator = require("mongoose-unique-validator")
const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true }
})

// Appliquez le plugin uniqueValidator à userSchema
// Cela va ajouter un champ unique à l'objet userSchema
// et ajouter une validation à l'objet userSchema
// qui vérifie que l'email est unique
// (c'est-à-dire qu'il n'existe pas déjà dans la base de données)
// En cas d'erreur, la validation retourne une erreur
// qui sera affichée à l'utilisateur
userSchema.plugin(uniqueValidator)

// Création du model User avec le schéma userSchema 
const User = mongoose.model("User", userSchema) 

// export du model User et du schéma userSchema pour être utilisé dans les autres fichiers du projet 
module.exports = { User, userSchema } 
