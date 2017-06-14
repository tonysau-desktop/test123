var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EtudiantSchema  = new Schema({
    code: String,
    nom: String,
    prenom: String,
    message: String,
    hyperlien: String
});

var Etudiant = mongoose.model('Etudiant', EtudiantSchema);

module.exports = Etudiant;