
//Initialiser la Table de jeu à 0
var table = new Array(3);
    for(var i0=0;i0<3;i0++){
        table[i0] = new Array(3);
        for(j0=0;j0<3;j0++)
            table[i0][j0] = 0;
    }

//Ajouter X à la case séléctionné si elle est vide
//Lancer l'algorithme du recherche de min max
function ajouterX(i,j){
    coup = [];
    var tableJeu = new Array(3);
    if ((table[i][j] == 0 ) && !(verifierResultat(table))){
        table[i][j] = -1;
        aa = ""+i+""+j;
        document.getElementById(aa).innerHTML= "X" ;

        //Vue que les tableaux sont passés par références en javascript
        //On réalise une copie de la table de jeu dans un tableau intermediaire "tableJeu"
        for (var k=0;k<3;k++){
            tableJeu[k]= new Array(3)
            for (var l=0;l<3;l++)
                tableJeu[k][l]= table[k][l];
        }
        verifierResultat(tableJeu);

        //Mesure du temps avant appel de la fonction de recherche
        var date1 = new Date();

        coup = rechercheCoup(tableJeu);

        //Mesure du temps à la terminaison de la fonction de recherche
        var date2 = new Date();

        //marquer la position choisie par l'ordinateur
        table[coup[0]][coup[1]] = 1;
        aa = ""+coup[0]+""+coup[1];

        //ajouter " O " à la case séléctionné
        document.getElementById(aa).innerHTML= "O" ;
        document.getElementById("time").innerHTML = "temps mis pour choisir un coup : " + Math.abs(Number(date2.getMinutes()-date1.getMilliseconds())) +" ms" ;
        document.getElementById("time").className = "time"
        verifierResultat(table);
    }
}

//fonction qui verifie le resultat et change la vue (fichier Html) selon le résultat obtenu
function verifierResultat(tableJeu){
    if (calculScore(1,tableJeu)){
        document.getElementById("resultat").innerHTML ="Ordinateur a gagne !";
        document.getElementById("resultat").className = "perdu";
        document.getElementById("divBouton").className = "perduBouton";
        document.getElementById("rejouer").className = "btn btn-primary btn-lg btn-block";
        return 1;

    }
    else if(calculScore(-1,tableJeu)){
        document.getElementById("resultat").innerHTML ="Humain a gagne !";
        document.getElementById("resultat").className = "gagne";
        document.getElementById("divBouton").className = "gagne";
        document.getElementById("rejouer").className = "btn btn-primary btn-lg btn-block";
        return 2;

    }
    else if (verifNul(tableJeu)){
        document.getElementById("resultat").innerHTML ="Match Nul !";
        document.getElementById("resultat").className = "nul";
        document.getElementById("divBouton").className = "nulBouton";
        document.getElementById("rejouer").className = "btn btn-primary btn-lg btn-block";
        return 3;
    }
    return 0;
}

//vérifier si le match est nul (toute les cases sont remplies et aucun gagnant)
function verifNul(tableJeu){
    for(var i10=0;i10<3;i10++)
        for(var j10=0;j10<3;j10++)
            if(tableJeu[i10][j10] == 0)
                return 0;
    return 1;
}

//calculScore vérifie si la table courante contient une combinaison gagnante pour le joueur x
//alors elle retourne 1 sinon elle retourne 0 (pas de combinaison gagnante et non pas que l'autre joueur a gagné!!)
function calculScore(x,tableJeu){
    for(var i1=0;i1<3;i1++)
        if((tableJeu[i1][0] == x)&&(tableJeu[i1][1] == x)&&(tableJeu[i1][2] == x))
            return 1;
    for(var j1=0;j1<3;j1++)
        if((tableJeu[0][j1] == x)&&(tableJeu[1][j1] == x)&&(tableJeu[2][j1] == x))
            return 1;
    if((tableJeu[0][0] == x)&&(tableJeu[1][1] == x)&&(tableJeu[2][2] == x))
        return 1;
    if((tableJeu[2][0] == x)&&(tableJeu[1][1] == x)&&(tableJeu[0][2] == x))
        return 1;
    return 0;
}

//réalise un coup pour le joueur " joueur " dans table[pos1][pos2]
//Retourne le nouveau tableau si table[pos1][pos2] est vide
//Retourne null sinon
function jouerCoup(table,joueur,pos1,pos2){

    //On copie le tableau pour ne pas abimer l'original
    var tableJeuInetrmediaire = new Array(3);
    for (var kk=0; kk<3; kk++){
        tableJeuInetrmediaire[kk] = new Array(3);
        for (var jj1=0 ;jj1<3 ; jj1++)
            tableJeuInetrmediaire[kk][jj1] = table[kk][jj1];
    }
    if (tableJeuInetrmediaire[pos1][pos2] == 0){
        tableJeuInetrmediaire[pos1][pos2] = joueur ;
        return tableJeuInetrmediaire;
    }
    return null;
}

//On recherche les positions possibles puis on choisit celle avec la plus grande valeur
//On apelle la fonction min pour avoir le minimum du niveau suivant
//ç-a-d simuler le meilleur coup de l'adversaire
function rechercheCoup(tableJeu){
    var maxScore = -5000 ;
    var pos1 = 0;
    var pos2 = 0;
    for(var i2=0;i2<3;i2++){
        for (var j2 = 0; j2 < 3; j2++){
            var tableJeuInter = jouerCoup(tableJeu, 1, i2, j2);
            if (tableJeuInter) {
                console.log("coup jouable => " + i2 + " " + j2);
                var valeur = Min(tableJeuInter);
                if (valeur > maxScore) {
                    maxScore = valeur;
                    pos1 = i2;
                    pos2 = j2;
                }
            }
        }
    }
    return [pos1,pos2,tableJeuInter];
}

//Niveau Minimisant : Retourner la valeur Min parmi tous les coups possibles
//5000 est la representation de notre valeur infini
//On appelle la fonction max du niveau suivant
function Min(tableJeu){
    if (calculScore(1,tableJeu))
        return 10;
    else if (calculScore(-1,tableJeu))
        return -10;
    else if (verifNul(tableJeu))
        return 0;
    else {
        var minScore = 5000;
        var pos1 = 0;
        var pos2 = 0;
        for (var i3 = 0; i3 < 3; i3++){
            for (var j3 = 0; j3 < 3; j3++){
                var tableJeuInter = jouerCoup(tableJeu, -1, i3, j3);
                if (tableJeuInter != null) {
                    var valeur = Max(tableJeuInter)
                    if (valeur < minScore) {
                        minScore = valeur;
                        pos1 = i3;
                        pos2 = j3;
                    }
                }
            }
        }
        return minScore;
    }
}


//Niveau Maximisant : Recherche de la valeur Max parmi tous les coups possibles
//-5000 est notre representation de la valeur  -l'infini
//On appelle la fonction min du niveau suivant
function Max(tableJeu){
    if(calculScore(1,tableJeu))
        return 10;
    else if (calculScore(-1,tableJeu))
        return -10;
    else if (verifNul(tableJeu))
        return 0;
    else{
        var maxScore = -5000 ;
        var pos1 = 0;
        var pos2 = 0;
        for (var i4=0;i4<3;i4++){
            for (var j4 = 0; j4 < 3; j4++){
                var tableJeuInter = jouerCoup(tableJeu, 1, i4, j4);
                if (tableJeuInter) {
                    var valeur = Min(tableJeuInter);
                    if (valeur > maxScore) {
                        maxScore = valeur;
                        pos1 = i4;
                        pos2 = j4;
                    }
                }
            }
        }
        return maxScore;
    }
}