const mongoose = require("mongoose") 
// (fs) = système de fichiers
const {unlink} = require("fs/promises") 
const {Product} = require("../models/product") 

// obtient toutes les sauces  et les renvoie au client
// Trouver toutes les sauces 
// renvoie la réponse au client
function getSauces(req, res) { 
    Product.find({}) 
    .then((products) => res.send(products))
    //
    .catch((error) => res.status(400).json({ error })) 
}

// 1. obtient la sauce par identifiant
// 2. id = identifiant du produit
// 3. Trouver la sauce par identifiant
function getSauce(req, res) {
    const {id} = req.params 
    return Product.findById(id) 
}

// 1. récupère la sauce par identifiant
// 2. renvoie la sauce par identifiant
// 3. si le produit n'existe pas renvoie une erreur
function getSauceById(req, res) {
    getSauce(req, res)
    .then((product) => sendClientResponse(product, res)) 
    .catch((error) => res.status(500).json({ error }))
}

// 1. L'ordre de suppression du Produit est envoyer à Mongo
// 2. id = identifiant du produit
// 3. Trouver le produit par son identifiant et supprimer le produit de la base de données
// 4. renvoie la réponse au client
// 5. supprimer l'image du produit
// 6. supprimer le fichier image 
// 7. renvoie une erreur si le produit n'existe pas
function deleteSauce(req, res) {
    const {id} = req.params
    Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res ))
    .then((item) => deleteImage(item))
    .then((res) => console.log("fichier supprimé", res))
    .catch((error) => res.status(500).json({ error }))
}

//    L'ordre de modification du Produit est envoyer à Mongo
// 1. Mettre à jour la base de données avec le nouveau produit
// 2. Trouver le produit par son identifiant et modifier le produit de la base de données
// 3. id = identifiant du produit 
// 4. si il y a une nouvelle image crée le payload avec le nouveau nom de fichier
// 5. Mettre à jour la base de données avec le nouveau produit
// 6. renvoie la réponse au client
// 7. supprimer l'image du produit 
function modifySauce(req, res) { 
    const { params: { id }} = req 
    const hasNewImage = req.file != null 
    const payload = makePayload(hasNewImage, req) 
    Product.findByIdAndUpdate(id, payload) 
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("fichier supprimé", res))
    .catch((err) => console.error("Problème de mise à jour", err)) 
}

// fonction supprimer l'image du produit 
function deleteImage(product) { 
    if (product == null) return  
    console.log("Supprimer l'image", product) 
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink("images/" + imageToDelete) 
}

// fait que la charge utile a une nouvelle demande d'image
// 1. si il n'y a pas de nouvelle image
// 2. crée le nom du fichier requis pour l'URL de l'image
// 3. si il y a une nouvelle image
// 4. affiche le nom du fichier requis pour l'URL de l'image
// 5. affiche le payload avec le nouveau nom de fichier
function makePayload(hasNewImage, req) { 
    console.log("hasNewImage:", hasNewImage)
    if (!hasNewImage) return req.body 
    const payload = JSON.parse(req.body.sauce) 
    payload.imageUrl = makeImageUrl(req, req.file.fileName) 
    console.log("Nouvelle Image a Gerer")
    console.log("voici le payload:", payload)
    return payload
    }
    
// 1. envoyer la réponse du produit au client
// 2. si le produit existe renvoie le produit
// 3. si le produit n'existe pas renvoie une erreur
function sendClientResponse(product, res) {
    if (product == null) { 
        console.log("Rien à mettre à jour")
        return res.status(404).json({ message: "Objet introuvable dans la base de données"})
    }
        console.log("Bonne mise à jour:",product)       
        return Promise.resolve(res.status(200).send(product)).then(() => product)
}

// 1. crée le nom du fichier requis pour l'URL de l'image
// 2. renvoie le nom du fichier requis pour l'URL de l'image
function makeImageUrl(req, fileName) { 
    return req.protocol + "://" + req.get("host") + "/images/" + fileName 
}

// 1. crée une sauce
// 2. renvoie la sauce crée
// 3. enregistre la sauce dans la base de données
// 4. renvoie la réponse au client
// body = le contenu de la requête, file = le fichier envoyé
// fileName = nom du fichier envoyé par le client 
// JSON.parse = convertit le JSON en objet JavaScript 
// body.sauce = le contenu de la requête envoyé par le client
function createSauce(req, res) { 
    const {body, file} = req 
    const { fileName } = file 
    const sauce = JSON.parse(body.sauce) 
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce //

    // crée un nouveau produit à partir de la sauce et de l'image envoyée  par le client 
    const product = new Product({
        userId: userId,
        name: name, 
        manufacturer: manufacturer, 
        description: description, 
        mainPepper: mainPepper, 
        imageUrl: makeImageUrl(req, fileName),
        heat: heat, 
        likes: 0,
        dislikes: 0, 
        usersLiked: [],
        usersDisliked: [],
    });

    // enregistre la sauce dans la base de données  
    // renvoie la réponse au client
    // si la sauce a été enregistrée, renvoie la sauce  
    // si la sauce n'a pas été enregistrée, renvoie une erreur
    product.save() 
        .then(() => res.status(201).json({ message: "Object enregistré dans la base de données !"})) 
        .catch(error => res.status(400).json({ error })); //
};

// CE MESSAGE N'APPARAITRA QUE SI LIKE VAUT 1, -1, OU 0
// 1. like = 1 ou -1  (0 = pas de like) 
// 2. si like n'est pas 1, -1, ou 0 renvoie un message d'erreur 
// 3. récupère la sauce par son identifiant 
// 4. met à jour la sauce avec le nouveau vote 
// 5. sauvegarde la sauce dans la base de données 
// 6. renvoie la sauce au client 
// 7. renvoie une erreur 500 si le produit n'est pas trouvé 
function likeSauce(req, res) { 
    const {like, userId} = req.body 
    if (![1, -1, 0].includes(like)) return res.status(403).send({message: "Veuillez entrer un vote valide"}) 

    getSauce(req, res) 
    .then((product) => updateVote(product, like, userId, res))  
    .then((pr) => pr.save())  
    .then((prod) => sendClientResponse(prod, res)) 
    .catch((err) => res.status(500).send(err)) 
}

// 1 la fonction mettre à jour le vote d'utilisateur
// 2. si like = 1 ou -1  (0 = pas de like) renvoie incrementer ou decrementer le vote 
// 3. si like = 0 renvoie le vote à 0 
function updateVote(product, like, userId, res) { 
    if (like === 1 || like === -1) return incrementVote(product, userId, like) 
    return resetVote(product, userId, res) 
} //

// 1. la fonction réinitialiser le vote d'utilisateur
// 2. récupère les utilisateurs aimés et non aimés du produit 
// 3. si l'utilisateur n'est pas dans les deux tableaux, renvoie une erreur 
// 4. renvoie le rejet de la promesse que l'utilisateur semble avoir voté dans les deux sens
// 5. si l'utilisateur a aimé le produit, le retire de la liste des utilisateurs non aimés
// 6. renvoie la promesse rejetée L'utilisateur semble ne pas avoir voté 
// 7. si l'utilisateur a aimé le produit, le retire de la liste des utilisateurs aimés
// 8. décrémente le nombre de likes du produit
// utilisateurs du produit non aimés Filtre non aimé avec l'identifiant d'utilisateur 
// 9. renvoie la promesse réussite
// 10. décrémente le nombre de dislikes du produit
// 11. utilisateurs du produit non aimés Filtre non aimé avec l'identifiant d'utilisateur
// 12. renvoie la promesse réussite avec le produit
function resetVote(product, userId, res) { 
    const { usersLiked, usersDisliked } = product  
    if  ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))   
    return Promise.reject("L'utilisateur semble avoir voté dans les deux sens")  
    
    if  (![usersLiked, usersDisliked].some((arr) => arr.includes(userId))) 
    return Promise.reject("L'utilisateur semble ne pas avoir voté") 
    
    if (usersLiked.includes(userId)) { 
        --product.likes 
        product.usersLiked = product.usersLiked.filter((id) => id !== userId)
    }   else { 
        --product.dislikes 
        product.usersDisliked = product.usersDisliked.filter((id) => id !== userId) 
     }
    return product 
}

// 1 incrémenter le vote d'utilisateur 
// 2 récupère les utilisateurs aimés et non aimés du produit 
// 3 si like = 1 alors ajoute l'identifiant de l'utilisateur à la liste des utilisateurs aimés, 
// sinon ajoute l'identifiant de l'utilisateur à la liste des utilisateurs non aimés.
// 4 si l'utilisateur n'est pas dans le tableau, ajoute l'identifiant de l'utilisateur & renvoie le produit.
// si like = 1 alors ++product.likes sinon ++product.dislikes
function incrementVote(product, userId, like) {
    const {usersLiked, usersDisliked} = product
    const votresArray = like === 1 ? usersLiked : usersDisliked 
    if (votresArray.includes(userId)) return product 
    votresArray.push(userId) 
    like === 1 ? ++product.likes : ++product.dislikes
    return product 
}
  
// exporte les fonctions du module 
module.exports = {Product, getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce,} 