const game_screen = document.querySelector(".game_screen");

const OSZLOPOK = 12;
const SOROK = 9;

var wave = 1;

var wave_colors = [
    ["#8a2e42", "#df3551"],
];

var elet = 15;
var penz = 250;

var tiles = [
    [0, "grass"],
    [1, "path"],
    [2, "tree"],
    [3, "castle"],
    [4, "tower"]
];

var map = [
    ['0', '3', '0', '0', '0', '0', '0', '0', '0', '0', '2', '0'],
    ['0', '1', '0', '0', '2', '0', '0', '1', '1', '1', '1', '0'],
    ['0', '1', '1', '1', '1', '1', '0', '1', '0', '0', '1', '0'],
    ['0', '0', '0', '0', '0', '1', '1', '1', '0', '2', '1', '0'],
    ['0', '1', '1', '1', '0', '0', '0', '0', '0', '0', '1', '0'],
    ['2', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
    ['0', '1', '0', '0', '0', '2', '0', '0', '0', '0', '0', '0'],
    ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '3', '0'],
    ['0', '0', '0', '2', '0', '0', '0', '0', '0', '0', '0', '0']
];

function map_generator(s, o) {
    for (let i = 0; i < s; i++) {
        var x = `<div class="row m-0">`;

        for (let j = 0; j < o; j++) {

            var type = "";

            for (let k = 0; k < tiles.length; k++) {
                if (tiles[k][0] === Number(map[i][j])) {
                    type = tiles[k][1];
                }
            }

            if (type === "grass") {
                x += `<div class="oszlop tile ${type} s${i}o${j} col p-0" onclick="toronyLerakas(${i}, ${j}, this)"></div>`;
            } else {
                x += `<div class="oszlop tile ${type} col p-0"></div>`;
            }
        }

        x += `</div>`;
        game_screen.innerHTML += x;
    }
};


var towers = [];

function towerUpgrade(id) {
    if (towers[id]) {
        towers[id].upgrade();
    }
}

function toronyLerakas(i, j, elem) {
    if (map[i][j] === '4') {
        const tower = towers.find(t => t.x === i && t.y === j);

        if (tower) {
            tower.upgrade();
        }

        return;
    }

    if (penz < 25) {
        alert("Nincs elég pénzed!");
        return;
    }

    penz -= 25;
    map[i][j] = '4';

    const id = towers.length;
    const tower = new Tower(i, j, elem, id);

    towers.push(tower);

    kijelzo_frissites();
}

function waypoint_calculator() {
    var start = null;
    for (let i = 0; start === null && i < SOROK; i++) {
        for (let j = 0; start === null && j < OSZLOPOK; j++) {
            if (String(map[i][j]) === "1") {
                start = [i, j];
            }
        }
    }

    const iranyok = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ];

    var vanTovabb = true;

    var aktualis = start;
    var utolsoIrany = null;
    var jartTile = [start[0] + "," + start[1]];

    var waypointok = [start];

    while (vanTovabb) {
        vanTovabb = false;
        var leptunk = false;

        for (let i = 0; !leptunk && i < iranyok.length; i++) {

            var ujSor = aktualis[0] + iranyok[i][0];
            var ujOszlop = aktualis[1] + iranyok[i][1];

            var kulcs = ujSor + "," + ujOszlop;

            if (
                ujSor >= 0 && ujSor < SOROK &&
                ujOszlop >= 0 && ujOszlop < OSZLOPOK &&
                String(map[ujSor][ujOszlop]) === "1" &&
                !jartTile.includes(kulcs)
            ) {
                if (utolsoIrany !== null && utolsoIrany !== i) {
                    waypointok.push(aktualis);
                }
                utolsoIrany = i;
                aktualis = [ujSor, ujOszlop];
                jartTile.push(kulcs);
                leptunk = true;
                vanTovabb = true;
            }
        }
    }
    console.log(waypointok);

    waypointok.push(aktualis);
    return waypointok;
};

map_generator(SOROK, OSZLOPOK);

var waypointok = waypoint_calculator();
var enemyk = [];

function enemy_letrehozas() {
    var x = waypointok[0][1] + 0.5;
    var y = waypointok[0][0] + 0.5;
    var enemy = new Enemy(x, y, game_screen, wave_colors[wave - 1]);
    enemyk.push(enemy);
}

var SEBESSEG = 13;
var SPAWN_IDO = 1;

var spawnSzamlalo = 1;
var jatek = null;

var isWaveOver = false;
var enemykDarabszama = 0;

function kijelzo_frissites() {
    document.querySelector(".enemykSzama").innerHTML = enemykDarabszama + " db";
    document.querySelector(".wave").innerHTML = wave + ".";
    document.querySelector(".elet").innerHTML = elet;
    document.querySelector(".penz").innerHTML = penz;
}

function jatek_leallitas() {
    clearInterval(jatek);
    jatek = null;
    isWaveOver = false;
}

document.querySelector(".start").addEventListener("click", () => {
    if (jatek !== null) {
        return;
    }

    var ido = Date.now();

    jatek = setInterval(() => {
        var most = Date.now();
        var dt = Math.min((most - ido) / 1000, 0.05);
        ido = most;

        spawnSzamlalo += dt;

        if(enemykDarabszama == 5){
            isWaveOver = true;
            if(game_screen.querySelectorAll(".enemy").length == 0){
                alert("A(z) " + wave + ". vege!");
                jatek_leallitas();
            }
        }

        if (spawnSzamlalo >= SPAWN_IDO && !isWaveOver) {
            spawnSzamlalo -= SPAWN_IDO;

            enemy_letrehozas();
            enemykDarabszama++;

            kijelzo_frissites();
        }

        for (let i = enemyk.length - 1; i >= 0; i--) {
            enemyk[i].lep(SEBESSEG * dt);

            if (enemyk[i].veget_ert()) {
                enemyk[i].torol();
                enemyk.splice(i, 1);
                enemykDarabszama--;
                elet--;
                kijelzo_frissites();
            }
        }

        if (elet == 0) {
            elet = 15;
            jatek_leallitas();
            alert("Veszetettel!");
        }
    }, 1);
});

kijelzo_frissites();
