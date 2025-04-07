
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

const users = [
    { name: "Brice", year: 22 },
    { name: "Alice", year: 20},
    { name: "Bob", year: 30 },
    { name: "Charlie", year: 17},
    { name: 'John', year: 25 },
    { name: 'Jane', year: 28 },
]

//Implémentez une fonction qui prend en entrée ce tableau et un critère de filtrage.
//La fonction doit retourner un nouveau tableau contenant uniquement les éléments qui répondent au critère spécifié.
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
function filterBy(users, name, maxYear, minYear) {
    return users.filter((user) => user.name.includes(name) && user.year <= maxYear && user.year >= minYear);
}

console.log(filterBy(users, "B", 24, 20));