var penz = 1000
var towers = []
var enemyk = []
var OSZLOPOK = 10
var SOROK = 10
var waypointok = [[0, 0], [0, 4], [3, 4]]
var map = []
for (var i = 0; i < 10; i++) {
    map.push(Array(10).fill("1"))
}
var towerInfosHivasok = []
var kijelzoHivasok = 0
var alertek = []

function towerInfos(index) {
    towerInfosHivasok.push(index)
}

function kijelzo_frissites() {
    kijelzoHivasok++
}

window.alert = function (uzenet) {
    alertek.push(uzenet)
}

function kozel(a, b) {
    return Math.abs(a - b) < 0.0001
}

function domReset() {
    document.body.innerHTML = '<div class="waveInfos d-none"></div><div class="gameInfos d-none"></div><div class="towerInfos">x</div>'
}

function ujTile() {
    var tile = document.createElement("div")
    document.body.appendChild(tile)
    return tile
}

function hpSzelesseg(enemyElem) {
    return parseFloat(enemyElem.querySelector(".progress-bar").style.width)
}

function hpWidth(enemyElem) {
    return hpSzelesseg(enemyElem)
}

function hamisEllenseg(x, y, halott) {
    return {
        x: x,
        y: y,
        halott: halott === true,
        sebzesek: [],
        meregAdat: null,
        lassitasAdat: null,
        takeDamage: function (d) { this.sebzesek.push(d) },
        applyPoison: function (dps, ido) { this.meregAdat = [dps, ido] },
        applySlow: function (f, ido) { this.lassitasAdat = [f, ido] },
        getX: function () { return this.x },
        getY: function () { return this.y },
        isDead: function () { return this.halott }
    }
}