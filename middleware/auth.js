const jwt = require("jsonwebtoken")

// authentifier l'utilisateur Accepter ou refuser 
// si l'en-tête est = nul, l'état de retour 401 envoie un message non valide
// split pour séparer le token  
// si err renvoie l'état res 401 envoie un message Jeton invalide + err     
// jwt vérifie le processus de jeton env MOT DE PASSE JWT
// le token est valide
// le token est invalide
// le token est nul
function authenticateUser(req, res, next) { 
    // pour voir si le code est exécuté 
    console.log("authenticate User") 
    // 1. récupérer le token dans l'en-tête de la requête 
    const header = req.header("Authorization");
    // 2. vérifier si le token est nul 
    if (header == null) return res.status(401).send({message: "Invalide"})
    // 3. split pour séparer le token 
    const token = header.split(" ")[1] 
    // 4.si err renvoie l'état res 401 envoie un message Jeton invalide + err      
    if (token == null) return res.status(401).send({message: "Token ne peut pas être nul"})
    
    // le token est valide 
    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {   
        // si err renvoie l'état res 401 envoie un message Jeton invalide + err 
        if (err) return res.status(401).send({message: " Token invalide " + err}) 
        // pour voir si le code est exécuté  
        console.log("Le token est bien valide on continue") 
        next() // pour continuer le code 
    })
}

// export de la fonction authenticateUser pour être utilisé dans les autres fichiers du projet
module.exports = {authenticateUser}  