
//Créez une fonction generateToken(user) qui prend en entrée un objet JSON représentant un utilisateur.
//https://www.w3schools.com/jsref/met_win_btoa.asp
function generateToken(user) {
    return btoa(JSON.stringify(user));
}

console.log(generateToken({ name: "KUCA Brice", year: 22 }));

//Créez une fonction verifyToken(token) qui décode le token et renvoie l’objet utilisateur
//https://www.w3schools.com/jsref/met_win_atob.asp
function verifyToken(token) {
    return atob(token);
}

console.log(verifyToken(generateToken({ name: "KUCA Brice", year: 22 })));
