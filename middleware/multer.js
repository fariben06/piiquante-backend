const multer = require("multer")
// créer un objet multer qui contient les paramètres de configuration du multer 
const storage = multer.diskStorage({ 
    destination: "images/",
    filename: function (req, file, cb){ // cb = callback 
        cb(null, makeFilename(req, file)) 
    }
})

// 1. créer un nom du fichier unique en fonction de l'id de l'utilisateur
// 2. renvoie le nom du fichier unique 
// file.originalname = nom du fichier original (avec l'extension) 
// remplace les espaces par des tirets (-) 
// ajoute le nom du fichier unique à l'objet file 
// renvoie le nom du fichier unique 
function makeFilename(req, file) {
    console.log("req, file:", file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-") 
    file.fileName = fileName 
    return fileName 
}
// créer un objet multer qui contient les paramètres de configuration du multer 
const upload = multer({ storage }) 

// export de l'objet upload pour être utilisé dans les autres fichiers du projet
module.exports = {upload}  

