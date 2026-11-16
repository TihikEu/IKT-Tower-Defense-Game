var mentettPenz = penz;
var mentettKijelzo = window.kijelzo_frissites;
var mentettAlert = window.alert;

var dummyWave = document.createElement("div"); dummyWave.className = "waveInfos"; document.body.appendChild(dummyWave);
var dummyGame = document.createElement("div"); dummyGame.className = "gameInfos"; document.body.appendChild(dummyGame);
var dummyInfos = document.createElement("div"); dummyInfos.className = "towerInfos"; document.body.appendChild(dummyInfos);

window.alert = function () { };
window.kijelzo_frissites = function () { };

var testTile = document.createElement("div");


var t1 = new Tower(2, 3, testTile, 0);

console.assert(t1.getX() === 2, "Hiba: getX");
console.assert(t1.getY() === 3, "Hiba: getY");
console.assert(t1.getDamage() === 20, "Hiba: getDamage alapból nem 20");
console.assert(t1.getRange() === 1.5, "Hiba: getRange alapból nem 1.5");
console.assert(t1.getFireRate() === 1.5, "Hiba: getFireRate alapból nem 1.5");
console.assert(t1.getCooldown() === 0, "Hiba: getCooldown alapból nem 0");
console.assert(t1.typeClass() === "tower-basic", "Hiba: typeClass");
console.assert(t1.typeName() === "Basic Tower", "Hiba: typeName");
console.assert(testTile.children.length === 1, "Hiba: a torony DOM eleme nem generálódott le");

var celpont = {
    hp: 100,
    takeDamage: function (d) {
        this.hp -= d;
    }
};

t1.attack(celpont);
console.assert(celpont.hp === 80, "Hiba: attack nem sebzett 20-at");

t1.setCooldown(5);
console.assert(t1.getCooldown() === 5, "Hiba: setCooldown 5-re állítás");
t1.setCooldown(-2);
console.assert(t1.getCooldown() === 0, "Hiba: setCooldown negatív értéknél nem 0-ra állít");

penz = 1000;
var ar1 = t1.getUpgradeCosts()[0];

t1.upgradeDamage();
console.assert(t1.getDamage() === 25, "Hiba: upgradeDamage nem növelte a sebzést 5-tel");
console.assert(t1.getDamage_level() === 2, "Hiba: upgradeDamage nem növelte a szintet");
console.assert(penz === 1000 - ar1, "Hiba: upgradeDamage nem vonta le a pénzt");
console.assert(t1.getUpgradeCosts()[0] === ar1 + 5, "Hiba: upgradeDamage nem növelte a következő szint költségét");

t1.upgradeFirerate();
console.assert(t1.getFireRate() === 1.25, "Hiba: upgradeFirerate nem csökkentette a firerate-et 0.25-tel");
console.assert(t1.getFirerate_level() === 2, "Hiba: upgradeFirerate nem növelte a szintet");

t1.upgradeRange();
console.assert(t1.getRange() === 1.75, "Hiba: upgradeRange nem növelte a range-et 0.25-tel");
console.assert(t1.getRange_level() === 2, "Hiba: upgradeRange nem növelte a szintet");


t1.upgradeDamage();
var penzMaxSzinten = penz;
t1.upgradeDamage();
console.assert(t1.getDamage_level() === 3, "Hiba: a szint 3 fölé ment!");
console.assert(penz === penzMaxSzinten, "Hiba: max szinten is levonta a pénzt!");


penz = 0;
t1.upgradeFirerate();
console.assert(t1.getFirerate_level() === 2, "Hiba: 0 pénznél is sikerült fejleszteni!");

penz = mentettPenz;
window.alert = mentettAlert;
window.kijelzo_frissites = mentettKijelzo;

dummyWave.remove();
dummyGame.remove();
dummyInfos.remove();
testTile.innerHTML = "";
