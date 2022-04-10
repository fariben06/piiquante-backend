require("dotenv").config() 
const express = require("express")
const app = express()
const cors = require("cors") 


// Middleware = est un logiciel qui crée la connexion entre plusieurs 
// applications et leur fournit des fonctionnalités et des service
// (cors) pour autoriser les requêtes cross-origin (de l'autre site)
// pour parser les requêtes en JSON (pour les requêtes POST) 
app.use(cors())  
app.use(express.json()) 

module.exports = { app, express }
