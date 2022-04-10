// 1. Créer une base de données
// 2. Créer une collection
const mongoose = require("mongoose");
//pour la validation unique d'un champ dans la base de données 
const uniqueValidator = require("mongoose-unique-validator")

// jwtPassword = process.env.JWT_PASSWORD
// le mot de passe haché est stocké dans le fichier .env
// Il est stocké en clair dans le fichier .gitignore (pour ne pas le voir dans le repo)
const password = process.env.DB_PASSWORD 
// le nom d'utilisateur de la base de données
const username = process.env.DB_USER
// le nom de la base de données   
const db = process.env.DB_NAME 
// le chemin de la base de données 
const uri = `mongodb+srv://${username}:${password}@cluster0.td2gv.mongodb.net/${db}?retryWrites=true&w=majority`;

// 1. Créer une base de données 
mongoose 
// 2. connecter à la base de données 
.connect(uri) 
// 3. afficher un message de succès si la connexion est réussie
.then(() => console.log("Connexion à MongoDB réussie !")) 
// 4. afficher un message d'erreur si la connexion échoue
.catch((err) => console.error("Erreur de connexion à Mongo:", err)) 

// le module mongoose est exporté pour être utilisé dans les autres fichiers du projet 
module.exports = {mongoose, uniqueValidator} 

