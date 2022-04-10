const express = require("express")
const { 
    getSauces, 
    createSauce, 
    getSauceById, 
    deleteSauce, 
    modifySauce,
    likeSauce
    // import du controller de la sauce (création, récupération, suppression, modification) 
} = require("../controllers/sauces") 
const { authenticateUser } = require("../middleware/auth")
const {upload} = require("../middleware/multer")
const saucesRouter = express.Router()
const bodyParser = require("body-parser")

saucesRouter.use(bodyParser.json())
saucesRouter.use(authenticateUser)

// 1. get all sauces 
// 2. upload.single("image") = pour uploader une image unique (image) 
// 3. get sauce by id 
// 4. delete sauce by id 
// 5. put pour modifier une sauce 
// 6. like a sauce 
// 7. export du router pour l'utiliser dans le server.js (index.js)
saucesRouter.get("/", getSauces) 
saucesRouter.post("/", upload.single("image"), createSauce)
saucesRouter.get("/:id", getSauceById) 
saucesRouter.delete("/:id", deleteSauce) 
saucesRouter.put("/:id", upload.single("image"),modifySauce) 
saucesRouter.post("/:id/like", likeSauce)

module.exports = {saucesRouter} 
