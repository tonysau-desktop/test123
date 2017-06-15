var express    = require('express');
var app        = express(); 
var bodyParser = require('body-parser');
var path = require('path');
var monmessage = "Voici un message pour Partie 2!";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// Route de test, sur /api
router.get('/', function(req, res) {
    res.json({ message: monmessage});
});

// --------------------
// ROUTES D'API
// --------------------
var router = express.Router();

// Routeur qui reçoit tous les messages et les route à l'endroit approprié
router.use(function(req, res, next) 
{    next(); // Continue à la route
});

// --------------------
// ROUTES D'API
// --------------------
router.route("/message")

//Obtenir le message
    .get(function(req, res) {
        res.json({message: monmessage});
    });

router.route("/message")
//Modifier le message
    .put(function(req, res) {

        monmessage = req.body.message;

        res.json({message: 'Message modifié avec succès!'});
    });

// FIN DES ROUTES

//Enregistre les routes d'API pour qu'elles soient accessibles sur /api
app.use('/api', router);

// Démarre le serveur
app.listen(port);
console.log('Serveur démarré sur le port ' + port);