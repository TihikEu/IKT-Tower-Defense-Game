var OSZLOPOK = 10
var SOROK = 10
var waypointok = [[0, 0], [0, 5], [5, 5]]

function kozel(a, b) { // a lep() szamolas kerekitesi hibaja miatt nezem meg az abszolut erteket
    return Math.abs(a - b) < 0.000001
}

var jatekter = document.createElement("div")
document.body.appendChild(jatekter)

var enemy = new Enemy(0.5, 0.5, jatekter, "red")


console.assert(enemy.getX() === 0.5, "Hiba a getX() metódus működésében!")
console.assert(enemy.getY() === 0.5, "Hiba a getY() metódus működésében!")
console.assert(enemy.getHitbox_color() === "red", "Hiba a getHitbox_color() metódus működésében!")


enemy.setX(3)
console.assert(enemy.getX() === 3, "Hiba a setX() metódus működésében, nem menti el az új értéket")
enemy.setY(4)
console.assert(enemy.getY() === 4, "Hiba a setY() metódus működésében, nem menti el az új értéket")
enemy.setHitbox_color("blue")
console.assert(enemy.getHitbox_color() === "blue", "Hiba a setHitbox_color() metódus működésében, nem menti el az új színt")
enemy.setX(0.5)
enemy.setY(0.5)
enemy.setHitbox_color("red")


console.assert(jatekter.children.length === 1, "Hiba a konstruktorban, nem teszi be az ellenséget a játéktérbe")
console.assert(jatekter.querySelector(".enemy") !== null, "Hiba a createElement() metódusban, hiányzik az .enemy elem")
console.assert(jatekter.querySelector(".enemy_hitbox") !== null, "Hiba a createElement() metódusban, hiányzik az .enemy_hitbox elem")
console.assert(jatekter.querySelector(".enemy_hp") !== null, "Hiba a createElement() metódusban, hiányzik az .enemy_hp elem")
console.assert(jatekter.querySelector(".enemy").children.length === 2, "Hiba a createElement() metódusban, a hitbox és az életcsík nem a .enemy elemben van")
console.assert(jatekter.querySelector(".enemy_hitbox").style.background === "red", "Hiba a createElement() metódusban, rossz hitbox szín")


console.assert(enemy.veget_ert() === false, "Hiba a veget_ert() metódusban, induláskor még nem érhetett a végére")


enemy.lep(0)
console.assert(enemy.getX() === 0.5 && enemy.getY() === 0.5, "Hiba a lep() metódusban, 0 lépésnél is mozog")

enemy.lep(2) 
console.assert(kozel(enemy.getX(), 2.5), "Hiba a lep() metódusban, egyenes szakaszon rossz az x érték")
console.assert(kozel(enemy.getY(), 0.5), "Hiba a lep() metódusban, egyenes szakaszon változik az y érték")

enemy.lep(3)
console.assert(kozel(enemy.getX(), 5.5), "Hiba a lep() metódusban, nem éri el pontosan a waypointot")
console.assert(kozel(enemy.getY(), 0.5), "Hiba a lep() metódusban, a waypointnál rossz az y érték")
console.assert(enemy.veget_ert() === false, "Hiba a veget_ert() metódusban, a köztes waypointnál még nem érhet a végére")

enemy.lep(2)
console.assert(kozel(enemy.getX(), 5.5), "Hiba a lep() metódusban, kanyar után változik az x érték")
console.assert(kozel(enemy.getY(), 2.5), "Hiba a lep() metódusban, kanyar után nem megy lefelé")

enemy.lep(100)
console.assert(enemy.getX() === 5.5 && enemy.getY() === 5.5, "Hiba a lep() metódusban, túllépi a végpontot")
console.assert(enemy.veget_ert() === true, "Hiba a veget_ert() metódusban, nem ismeri fel hogy a végére ért")

enemy.lep(5)
console.assert(enemy.getX() === 5.5 && enemy.getY() === 5.5, "Hiba a lep() metódusban, a végpont után is mozog")


var enemy2 = new Enemy(0.5, 0.5, jatekter, "green")
console.assert(jatekter.children.length === 2, "Hiba a konstruktorban, a második ellenség nem kerül a játéktérbe")
enemy2.lep(7)
console.assert(kozel(enemy2.getX(), 5.5) && kozel(enemy2.getY(), 2.5), "Hiba a lep() metódusban, egy lépésből nem megy át a waypointon")
enemy2.torol()
console.assert(jatekter.children.length === 1, "Hiba a torol() metódusban, nem törli az elemet a játéktérből")


enemy.torol()
console.assert(jatekter.children.length === 0, "Hiba a torol() metódusban, nem törli az elemet a játéktérből")

//hianyos maga a classod, nem csinalsz semmit a hp-val
