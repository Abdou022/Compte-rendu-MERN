// Exercice 2 : les notions JavaScript de la séance

const produits = [
  { nom: "Clavier", prix: 45 },
  { nom: "Écran", prix: 320 },
  { nom: "Souris", prix: 25 },
];

// 1. Déstructuration du premier produit
const { nom, prix } = produits[0];
console.log(nom, prix);

// 2. find : trouver le produit "Souris"
const souris = produits.find((produit) => produit.nom === "Souris");
console.log(souris.prix);

// 3. filter : produits dont le prix est inférieur à 100
const produitsMoinsDe100 = produits.filter((produit) => produit.prix < 100);
console.log(produitsMoinsDe100);

// 4. Fonction fléchée avecRemise
const avecRemise = (prix) => prix - (prix * 10) / 100;
console.log(avecRemise(320));
