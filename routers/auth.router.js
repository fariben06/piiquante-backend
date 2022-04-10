// Controllers
// import du controller de l'utilisateur (création et connexion) 
// import du module express pour le serveur
// création d'un router pour l'authentification (pour les routes de l'utilisateur) 
const { createUser, logUser } = require("../controllers/users") 
const express = require("express")  
const authRouter = express.Router() 

// Routes 
// pour créer un utilisateur 
// pour se connecter 
authRouter.post("/signup", createUser) 
authRouter.post("/login", logUser) 

// export du router pour l'utiliser dans le server.js (index.js) 
module.exports = {authRouter} 
