//Charge la liste des étudiants d'un CSV et les enregistre dans la BD
var http = require ('http');
var mongoose = require ("mongoose");

var uri = 
  process.env.MONGOLAB_URI || 
  'mongodb://test:test@ds031872.mongolab.com:31872/demomango';

mongoose.connect(uri, function (err, res) {
  if (err) { 
    console.log ('Erreur pour se connecter à: ' + uri + '. ' + err);
  } else {
    console.log ('Connexion réussie à : ' + uri);
  }
});
var Etudiant = require('./models/etudiant');

//Enlève les données précédentes
Etudiant.remove({}, function(err) {
  if (err) {
    console.log ('error deleting old data.');
  }
});

//Parser CSV -> JSON
var Parser = require('./parser');

// Module de fileSystem
var fs = require('fs');

// Lis le fichier en mémoire
fs.readFile('./models/etudiants.csv', function (err, fichierEtudiants) {
  
	if (err) throw err;
  	var contenuFichier = fichierEtudiants.toString();
 	var parser = new Parser();
 	var etudiants = parser.parse(contenuFichier);

	for(var i=0;i<etudiants.length;i++){
		var etudiant = JSON.parse(etudiants[i]);
		etudiant["message"] = '';
    etudiant["hyperlien"] = '';
 		Etudiant.collection.insert(etudiant);
    }
    console.log("Chargement terminé");
});