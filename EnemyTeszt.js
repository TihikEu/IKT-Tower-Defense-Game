var screen = document.createElement("div");
screen.style.display = "none";
document.body.appendChild(screen);


var e1 = new Enemy(0.5, 0.5, screen, ["#ff0000", "#990000"]);
var el1 = screen.lastChild;
var hp1 = el1.children[1].children[0];

console.assert(e1.getX() === 0.5, "Hiba: getX");
console.assert(e1.getY() === 0.5, "Hiba: getY");
console.assert(e1.getSpeed() === 1, "Hiba: getSpeed alapból nem 1");
console.assert(e1.isDead() === false, "Hiba: isDead élőnél");
console.assert(e1.getReward() === 15, "Hiba: getReward");
console.assert(e1.baseHp() === 100, "Hiba: baseHp");
console.assert(e1.typeClass() === "enemy-normal", "Hiba: typeClass");
console.assert(parseFloat(hp1.style.width) === 100, "Hiba: kezdeti HP nem 100%");


var vartLeft = 0.5 / OSZLOPOK * 100;
var vartTop = 0.5 / SOROK * 100;
console.assert(Math.abs(parseFloat(el1.style.left) - vartLeft) < 0.01, "Hiba: draw() left érték");
console.assert(Math.abs(parseFloat(el1.style.top) - vartTop) < 0.01, "Hiba: draw() top érték");


e1.setX(2);
e1.setY(3);
e1.setHitbox_color(["blue", "darkblue"]);
console.assert(e1.getX() === 2, "Hiba: setX");
console.assert(e1.getY() === 3, "Hiba: setY");
console.assert(e1.getHitbox_color()[0] === "blue", "Hiba: setHitbox_color");


e1.takeDamage(30);
console.assert(Math.abs(parseFloat(hp1.style.width) - 70) < 0.01, "Hiba: takeDamage 30 után nem 70%");

e1.heal(20);
console.assert(Math.abs(parseFloat(hp1.style.width) - 90) < 0.01, "Hiba: heal 20 után nem 90%");

e1.heal(50);
console.assert(parseFloat(hp1.style.width) === 100, "Hiba: heal túl tud gyógyítani max HP-n");

e1.takeDamage(200);
console.assert(e1.isDead() === true, "Hiba: 0 HP-nál nem halott");
console.assert(parseFloat(hp1.style.width) === 0, "Hiba: halál után nem 0%-ra állítja a HP-t");

e1.heal(50);
console.assert(e1.isDead() === true, "Hiba: heal() feltámasztja a halottat");


var e2 = new Enemy(0, 0, screen, ["red", "red"]);
var hp2 = screen.lastChild.children[1].children[0];

e2.applyPoison(10, 2);
e2.update(1);
console.assert(Math.abs(parseFloat(hp2.style.width) - 90) < 0.01, "Hiba: poison 1 sec után");

e2.update(1.5);
console.assert(Math.abs(parseFloat(hp2.style.width) - 75) < 0.01, "Hiba: poison további sebzése");

e2.update(1);
console.assert(Math.abs(parseFloat(hp2.style.width) - 75) < 0.01, "Hiba: lejárt poison tovább sebez");

var e3 = new Enemy(0, 0, screen, ["red", "red"]);
e3.applySlow(0.5, 2);
console.assert(e3.getSpeed() === 0.5, "Hiba: slow nem 0.5-re lassít");

e3.update(1);
console.assert(e3.getSpeed() === 0.5, "Hiba: slow 1 sec után megszűnt");

e3.update(1.5);
console.assert(e3.getSpeed() === 1, "Hiba: slow lejárta után nem állt vissza a sebesség");


var hookCalled = false;
e3.onUpdate = function () { hookCalled = true; };
e3.update(0.1);
console.assert(hookCalled === true, "Hiba: update() nem hívja meg az onUpdate()-et");


var kezdoX = waypointok[0][1] + 0.5;
var kezdoY = waypointok[0][0] + 0.5;
var e4 = new Enemy(kezdoX, kezdoY, screen, ["red", "red"]);

console.assert(e4.veget_ert() === false, "Hiba: frissen létrehozott ne legyen a pálya végén");


e4.lep(10000);
var utolsoWP = waypointok[waypointok.length - 1];

console.assert(e4.getX() === utolsoWP[1] + 0.5, "Hiba: nem érte el a pálya végét X-ben");
console.assert(e4.getY() === utolsoWP[0] + 0.5, "Hiba: nem érte el a pálya végét Y-ban");
console.assert(e4.veget_ert() === true, "Hiba: veget_ert nem igaz a pálya végén");


var elemekSzama = screen.children.length;
e4.torol();
console.assert(screen.children.length === elemekSzama - 1, "Hiba: torol() nem távolította el a DOM elemet");
