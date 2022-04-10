// 1 require il renvoie un objet avec 2 clés {mongoose, User} de la page mongo.js
// 2 fonctions de hachage
// 3 JWT sont des jetons générés par un serveur lors de l'authentification d'un utilisateur sur une application Web
const  { User } = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// 1 fonction asynchrone créer utilisateur req, res
// 2 Cet objet de gauche est égal à l'objet de droite
// 3 Mot de passe haché = attendre le mot de passe haché
// 4 nouveau mot de passe de l'e-mail de l'utilisateur : mot de passe haché
// 5 (201 créé dans la base de donné) 
// 6 (409 erreur d'enregistrement)  
async function createUser(req, res) {
  try {
    const { email, password } = req.body
    const hashedPassword = await hashPassword(password)
    const user = new User({ email, password: hashedPassword })
    await user.save()      
    res.status(201).json({ message: "utilisateur enregistrés !"})
  } catch (error) { 
    res.status(409).json({ message: "utilisateur non enregistrés :" + error })
   }
}

// 1. récupère le mot de passe haché
// 2. renvoyer le mot de passe haché
// 10 est le nombre de fois que le mot de passe est haché
// return "mot de passe haché"
function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// journal de la fonction asynchrone Rés. de la demande de l'utilisateur
// 1. récupère l'utilisateur par e-mail
// 2. compare le mot de passe haché de l'utilisateur avec le mot de passe haché de la requête
// 3. si les mots de passe sont identiques, créer un jeton d'identification
// 4. si les mots de passe ne sont pas identiques, renvoyer un message d'erreur
// 5. renvoyer le jeton d'identification
// 6. renvoyer un message d'erreur
async function logUser(req, res) {
  try {
  const email = req.body.email
  const password = req.body.password
  const user = await User.findOne({ email: email })

  const isEmailInvalid = await bcrypt.compare(email, user.email)
  if (isEmailInvalid) {
    res.status(401).json({ error: "E-mail incorrect" })
  }

  const isPaswordOk = await bcrypt.compare(password, user.password)
  if (!isPaswordOk) {
    res.status(401).json({ error: "mot de passe incorrect" })
  }
  // 1 créer un e-mail de jeton
  // 2 renvoyer le jeton
  // 3 statut res 200 envoyer le jeton d'identification de l'identifiant de l'utilisateur
  // 4 res status 500 envoie un message Erreur interne
  const token = createToken(email)
    res.status(200).json({ userId: user?._id, token: token})
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Erreur interne"})
  }
}

// 1. récupère l'utilisateur par e-mail
// 2. créer un jeton d'identification
// 3. renvoyer le jeton
// 4. le mot de passe haché de l'utilisateur
function createToken(email) {
  const jwtPassword = process.env.JWT_PASSWORD
  // Argument de configuration avec une expiration de 24 heures
  return jwt.sign({email: email}, jwtPassword, {expiresIn: "24h"}) 
}

// exporte les fonctions créer utilisateur et logUser pour être utilisé dans les autres fichiers du projet
module.exports = {createUser, logUser} 