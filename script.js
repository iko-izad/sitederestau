const express = require("express");
 // le module fs permet de manipuler les fichier
// on crée l'application expressJs
const mysql2 = require("mysql2");
const myConnection = require("express-myconnection");
const url = require("url");
const connection = require("express-myconnection");


// Configuration des options de connexion à la base de données
const optionConnection = {
  host: "localhost", // Adresse du serveur de base de données
  user: "root", // Nom d'utilisateur pour se connecter à la base de données
  password: "Izad97640", // Mot de passe pour l'utilisateur
  port: 3306, // Port par défaut pour MySQL
  database: "restaurant" // Nom de la base de données à utiliser
};

// Création de l'application Express
const app = express();

// Middleware pour établir une connexion à la base de données
app.use(myConnection(mysql2, optionConnection, "pool")); // Utilisation de myConnection pour gérer les connexions

// Middleware pour analyser les données des formulaires
app.use(express.urlencoded({ extended: false })); // Permet de traiter les données URL-encoded

// Configuration des vues et du moteur de rendu
app.set("views", "./views"); // Dossier où se trouvent les fichiers de vue
app.set("view engine", "ejs"); // Utilisation de EJS comme moteur de rendu

// Middleware pour servir des fichiers statiques (CSS, images, etc.)
app.use(express.static("public")); // Dossier public pour les fichiers statiques

// Exemple de route pour traiter l'ajout d'un plat
app.post("/plat", (req, res) => {
console.log("corps requête Body: ", req.body); // Affiche le corps de la requête
console.log("corps requête nom: ", req.body.nom); // Affiche le nom du plat
console.log("corps requête prix: ", req.body.prix); // Affiche le prix du plat

// Récupération des données du plat à partir du corps de la requête
let platId;  // ID du plat
let nomPlat = req.body.nom; // Nom du plat
let prixPlat = req.body.prix; // Prix du plat
let requeteSQL;

if(req.body.id === "") {
  platId = null;
  requeteSQL = "(INSERT INTO plat(id, nom, prix) VALUES(?,?,?)";
} else {
  platId = req.body.id;
  requeteSQL = "UPDATE plat SET nom, prix = ? WHERE id = ?";
}


let ordreDonnes;
if(platId === null) {
  ordreDonnes = [null, nomPlat, prixPlat];
} else {
  ordreDonnes = [nomPlat, prixPlat,platId];
}

// Connexion à la base de données pour insérer le plat
req.getConnection((erreur, connection) => {
  if (erreur) {
    console.log(erreur); // Affiche l'erreur de connexion
  } else {
      connection.query(requeteSQL, ordreDonnes, (err, nouveauplat) => {
        if (err) {
        console.log(err); // Affiche l'erreur si l'insertion échoue
      } else {
        console.log("insertion réussie ==) "); // Affiche un message de succès
        res.status(300).redirect("/accueil"); // Redirige vers la page d'accueil après l'insertion
      }
    });
  }
});
});

// Route pour afficher la liste des plats à l'adresse //localhost:3001/accueil
app.get("/accueil", (req, res) => {
// Connexion à la base de données pour récupérer les plats
req.getConnection((erreur, connection) => {
  if (erreur) {
    console.log(erreur); // Affiche l'erreur de connexion
  } else {
    // Exécution de la requête pour sélectionner tous les plats
    connection.query("SELECT * FROM plat", [], (err, resulat) => {
      if (err) {
        console.log(err); // Affiche l'erreur si la requête échoue
      } else {
        console.log("resultat : ", resulat); // Affiche les résultats de la requête
        res.render("accueil", { resulat }); // Rendre la vue "accueil" avec les résultats
      }
    });
  }
});
});


app.get("/menu", (req, res) => {
  nosPlats = { // Changer le nom de la variable ici
   plats: [
     { nom: "Poulet rôti", prix: "15", image: "images/20240216_65cfa1ce1fa54.jpg" },
     { nom: "Saumon grillé", prix: "18", image: "images/107449_w1024h1024c1cx1060cy707cxt0cyt0cxb2121cyb1414.webp" },
     { nom: "Salade César", prix: "12", image: "images/saumon-grille.jpeg" },
   ]
 };

 // Passe nosPlats à la vue "menu"
 res.render("menu", nosPlats); // Changer ici pour correspondre au nom de la variable
});

app.get("/equipe", (req, res) => {
   membres = [ // Créer un tableau de membres
    { nom: "Jean Dupont", role: "Chef Cuisinier",image: "images/20230519_1_6_1_1_0_obj28084833_1.avif" },
    { nom: "Marie Curie", role: "Chef Pâtissier", image: "images/Jessica-Préalpato-Plaza-Athénée-c-Benjamin-Schmuchk-scaled.jpg" },
    { nom: "Thani Jr", role: "Serveur", image: "images/restaurant-waiter-in-a-holding-plate_9576373.webp"}
  ];

  // Passe membres à la vue "equipe"
  res.render("equipe", membres); // Passer le tableau de membres
});

// route pour /contact
app.get("/contact", (req, res) => {
   contactInfo = { // Créer un objet pour les informations de contact
    telephone: "01 23 45 67 89",
    horaires: "Lundi au Samedi de 11h à 13h puis de 18h à 00h"
  };

  // Passe contactInfo à la vue "contact"
  res.render("contact", contactInfo ); // Passer l'objet contactInfo
});

app.delete("/plat/:id", (req, res) => {
  let platId = req.params.id;

  req.getConnection((erreur, connection) => {
    if (erreur) {
      console.log(erreur);
    } else {
      connection.query("DELETE FROM plat WHERE id = ?",
        [platId], (err, result) => {
          if(err) {
            console.log(err);
          } else {
            console.log("Suppression réussie");
            res.status(300).redirect("/accueil");
          }
        }
      )
    }
  });
});

app.listen(3003, () => {
    console.log("serveur dispo");
});



module.exports = app;