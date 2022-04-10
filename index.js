// import du server et de l'express (pour le serveur) et du body-parser (pour le parser des requêtes) 
const { app, express } = require("./Server")  
const {saucesRouter} = require("./routers/sauces.router")
const {authRouter} = require("./routers/auth.router") 
const port = 3000
// pour utiliser le chemin absolu d'un fichier (pour les images) dans le navigateur
const path = require("path") 
// pour utiliser les fichiers statiques (images, css, js) dans le serveur (express)
const bodyParser = require("body-parser")

// Connexion à la base de données
require("./models/mongo")

// Middleware = est un logiciel qui crée la connexion entre plusieurs 
//applications et leur fournit des fonctionnalités et des service
// pour parser les requêtes en JSON (pour les requêtes POST) 
app.use(bodyParser.json())  
app.use("/api/sauces", saucesRouter) 
app.use("/api/auth", authRouter) 

// Routes
// pour tester le serveur (localhost:3000) 
app.get("/", (req, res) => res.send("hell world!")) 

// listen = port d'écoute de l'application
// pour accéder à l'image depuis le front end (avec le serveur)
// il faut utiliser le chemin absolu de l'image (chemin complet)
// pour accéder à l'image depuis le serveur, il faut utiliser le chemin relatif
// path.join = concaténation de deux chemins (chemin absolu et chemin relatif) 
// __dirname = chemin absolu du dossier courant
app.use("/images", express.static(path.join(__dirname, "images")))  
app.listen(port, () => console.log("listening on port" + port))

