const mongoose = require('mongoose');

const equipementSchema = new mongoose.Schema({
  code: { type: 'String', required: true },
  nom: String,
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Equipement = mongoose.model(
  'Equipement',
  equipementSchema,
  'equipements'
);

module.exports = Equipement;
