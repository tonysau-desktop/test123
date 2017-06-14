var express    = require('express');
var app        = express(); 
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); 

var port = process.env.PORT || 8080;

var mongoose   = require('mongoose');
var uri = 
  process.env.MONGOLAB_URI || 
  'mongodb://test:test@ds031872.mongolab.com:31872/demomango';

mongoose.connect(uri, function (err, res) {
  if (err) { 
    console.log ('Erreur pour se connecter à: ' + uri + '. ' + err);
  } else {
    console.log ('Connexion réussie à la BD' + uri);
  }
});

var fonctions = require('./scripts/fonctions.js');

var Etudiant = require('./models/etudiant');

// --------------------
// ROUTES D'API
// --------------------
var router = express.Router();

// Routeur qui reçoit tous les messages et les route à l'endroit approprié
router.use(function(req, res, next) 
{    next(); // Continue à la route
});


// Route de test, sur /api
router.get('/', function(req, res) {
    res.json({ message: 'Bienvenue sur l\'API de GTI525'});   
});

// --------------------
// ROUTES D'API
// --------------------
router.route('/etudiants')

    //obtenir tous les étudiants
    .get(function(req, res) {
        var Query = Etudiant.find().sort({'nom':1});
        Query.select('-_id');
        Query.exec(function (err, etudiants) {
            if (err) throw err;
            res.send(etudiants);
        });
    });

/*
Route désactivée pour la version en installation
router.route("/etudiants")
    // Ajouter un étudiant
    .post(function(req, res) {
        
        var etudiant = new Etudiant();   
        etudiant.code = req.body.code;
        etudiant.nom = req.body.nom;
        etudiant.prenom = req.body.prenom;

        // sauvegarde l'étudiant à la BD
        etudiant.save(function(err) {
            if (err){
                res.status(500).json({ erreur: 'Erreur lors de l\'enregistrement à la BD' });
                return;
            }
            res.json({ message: 'Étudiant ajouté' });
        });
        
    });
*/

router.route("/etudiants/:code")  //Prend le code permanent dans l'URL. Ex. /etudiant/BOIE10101010
    //Obtenir un seul étudiant
    .get(function(req, res) {
        Etudiant.find({'code':req.params.code}, function(err, etudiant) {
            if (err){
                res.send(err);
                return;
            }
            res.json(etudiant);
        });
    });

router.route("/etudiants/:id")
    //Afficher un étudiant et son message
    .put(function(req, res) {
        Etudiant.findById(req.params.id, function(err, etudiant) {

            if (err){
                res.status(500).json({ erreur: 'Erreur lors de la lecture dans la BD' });
                return;
            }

            if(req.body.message == null){
                res.status(400).json({ erreur: 'Le message doit être fourni dans le corps de la requête' });
                return;
            }

            etudiant.message = req.body.message;

            etudiant.save(function(err) {
                if (err){
                    res.status(500).json({ erreur: 'Erreur lors de l\'enregistrement à la BD' });
                    return;
                }
                res.json({ message: 'Message ajouté!' });
            });
        });
    });


router.route("/etudiants/:id/soumettreAPI")
    //Soumettre l'URL d'un API qui fournira le message
    .post(function(req, res) {
        Etudiant.findById(req.params.id, function(err, etudiant) {

            if (err){
                res.status(500).json({ erreur: 'Erreur lors de la lecture dans la BD' });
                return;
            }

            fonctions.getContent(req.body.hyperlien)
              .then((html) => {
                    console.log(html);

                    try{
                      //Lecture du contenu de la réponse à l'appel à l'API externe
                      var jsonMessage = JSON.parse(html);  
                      //Remplacement par la valeur de l'API
                      etudiant.message = jsonMessage.message;
                      etudiant.hyperlien = req.body.hyperlien;
                    }catch (formatException) {
                        res.status(400).json({ erreur: 'Le message retourné par l\'API fourni n\'est pas formatté correctement' });
                        return;
                    }

                    etudiant.save(function(erreurSauvegarde) {
                        if (erreurSauvegarde){
                            res.status(500).json({ erreur: 'Erreur lors de l\'enregistrement à la BD' });
                            return;
                        }
                        res.json({ message: 'Message obtenu de l\'API et a été enregistré!' });
                    });
                })
              .catch((err) => {
                    console.error(err.stack);
                    res.status(404).json({ erreur: 'L\'URL fourni dans le champ hyperlien est invalide' });
                }); 
        });
    });

// FIN DES ROUTES

//Enregistre les routes d'API pour qu'elles soient accessibles sur /api
app.use('/api', router);

// Page Angular de présentation des messages
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

// Démarre le serveur
app.listen(port);
console.log('Serveur démarré sur le port ' + port);