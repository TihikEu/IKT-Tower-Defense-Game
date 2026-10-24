const game_screen = document.querySelector(".game_screen");

const OSZLOPOK = 12;
const SOROK = 5;

var wave = 1;

var wave_colors = [
    "#ec3a61",
   "#3a69ec",
    "#ecd13a"
];

var tiles = [
    [0, "tiles/tile-0.png"],
    [1, "tiles/tile-1.png"],
    [2, "tiles/tile-2.png"]
];

var map = [
    ['2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0', '2'],
    ['2', '0', '0', '0', '2', '0', '0', '0', '0', '1', '0', '2'],
    ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0', '2'],
    ['0', '1', '0', '0', '0', '2', '0', '0', '0', '0', '0', '2'],
    ['2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1']
];

function map_generator(s, o) {
    for (let i = 0; i < s; i++) {
        var x = `<div class="row">`;

        for (let j = 0; j < o; j++) {
            var y = "";

            for (let k = 0; k < tiles.length; k++) {
                if (tiles[k][0] === Number(map[i][j])) {
                    y = tiles[k][1];
                }
            }

            x += `<div class="oszlop col p-0">
            <img class="tile" src="${y}">
        </div>`;
        }

        x += `</div>`;
        game_screen.innerHTML += x;
    }
};

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

var SEBESSEG = 1.5;
var SPAWN_IDO = .5;

var spawnSzamlalo = 1;
var elindult = false;
var jatek = null;

var enemykDarabszama = 0;

document.querySelector(".start").addEventListener("click", () => {
    if (jatek !== null) {
        return;
    }

    if (!elindult) {
        elindult = true;
    }

    var ido = Date.now();


    jatek = setInterval(() => {
        var most = Date.now();
        var dt = Math.min((most - ido) / 1000, 0.05);
        ido = most;

        spawnSzamlalo += dt;
        if (spawnSzamlalo >= SPAWN_IDO) {
            spawnSzamlalo -= SPAWN_IDO;
            enemy_letrehozas();
            if(enemykDarabszama == 15){
                if(wave < 3){
                    wave++;
                } else {
                    wave = 1;
                }
                enemykDarabszama = 0;
            } else {
                enemykDarabszama++;
            }
        }

        for (let i = enemyk.length - 1; i >= 0; i--) {
            enemyk[i].lep(SEBESSEG * dt);

            if (enemyk[i].veget_ert() || enemyk[i].halott()) {
                enemyk[i].torol();
                enemyk.splice(i, 1);
            }
        }
    }, 1);
});

document.querySelector(".stop").addEventListener("click", () => {
    clearInterval(jatek);
    jatek = null;
});
