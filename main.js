const game_screen = document.querySelector(".game_screen");

var wave = 1;
var waveInfos = [
    [10, 1, 1] // db, speed, hp || 1. wave
]

var wave_colors = [
    ["#8a2e42", "#df3551"],
];

var elet = 15;
var penz = 1000;

var tiles = [
    [0, "grass"],
    [1, "path"],
    [2, "tree"],
    [3, "end"],
    [4, "tower"],
    [5, "stone"],
    [6, "water"]
];

var map = [
    ['6', '6', '0', '5', '0', '0', '6', '6', '6', '0', '2', '0', '0', '0'],
    ['0', '0', '2', '0', '0', '0', '0', '0', '2', '0', '5', '0', '0', '0'],
    ['1', '1', '1', '0', '2', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '1', '0', '0', '1', '1', '1', '1', '0', '0', '0', '0', '0'],
    ['2', '0', '1', '0', '0', '1', '2', '0', '1', '0', '0', '1', '1', '3'],
    ['5', '0', '1', '1', '1', '1', '0', '0', '1', '0', '0', '1', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '1', '1', '1', '1', '0', '0'],
    ['6', '0', '0', '2', '0', '6', '6', '0', '2', '5', '0', '0', '0', '0']
];

const SOROK = map.length;
const OSZLOPOK = map[0].length;

function map_generator(s, o) {
    var x = "";
    for (let i = 0; i < s; i++) {
        x += `<div class="row m-0">`;

        for (let j = 0; j < o; j++) {
            var type = "";

            for (let k = 0; k < tiles.length; k++) {
                if (tiles[k][0] === Number(map[i][j])) {
                    type = tiles[k][1];
                }
            }

            if (type === "grass") {
                x += `<div class="oszlop tile ${type} s${i}o${j} col p-0" onclick="toronyLerakas(${i}, ${j}, this)"></div>`;
            } else if (type === "tree") {
                x += `<div class="oszlop tile grass col p-0"><div class="tree"></div></div>`;
            } else if (type === "stone") {
                x += `<div class="oszlop tile grass col p-0"><div class="stone"></div></div>`;
            } else {
                x += `<div class="oszlop tile ${type} col p-0"></div>`;
            }
        }

        x += `</div>`;
    }
    game_screen.innerHTML = x;
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
                (String(map[ujSor][ujOszlop]) === "1" || String(map[ujSor][ujOszlop]) === "3") &&
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

    waypointok.push(aktualis);

    return waypointok;
}

var towers = [];

function TowerRangeCalc(tx, ty, ex, ey) {
    var dx = (ty + 0.5) - ex;
    var dy = (tx + 0.5) - ey;

    return dx * dx + dy * dy;
}

function tamadas(enemy, torony) {
    if (!enemy.isDead() && torony.getCooldown() <= 0) {
        enemy.takeDamage(torony.getDamage());
        torony.setCooldown(torony.getFireRate());
    }
}

function towerInfos(id) {
    document.querySelector(".towerInfos").classList.remove("d-none");
    document.querySelector(".towerInfos").innerHTML =
        `<div class="rounded-2 d-flex justify-content-between align-items-center bg-1 p-5">
        <div class="d-flex align-items-center gap-5 w-75">
            <p class="m-0">Damage: <span class="ms-5">${towers[id].getDamage()}</span></p>
            <span>|</span>
            <span>${(towers[id].getDamage_level() === 3) ? '<i>Maxed out - level </i>' + towers[id].getDamage_level() : 'level ' + towers[id].getDamage_level() + ' --> next level: ' + + towers[id].getUpgradeCosts()[0] + ' $'}</span>
        </div>
        <button class="btn" onclick="towerDamageUpgrade(${id})">Fejlesztes</button>
    </div>

    <div class="rounded-2 d-flex justify-content-between align-items-center bg-1 p-5">
        <div class="d-flex align-items-center gap-5 w-75">
            <p class="m-0">Firerate: <span class="ms-5">${towers[id].getFireRate()}</span></p>
            <span>|</span>
            <span>${(towers[id].getFirerate_level() === 3) ? '<i>Maxed out - level </i>' + towers[id].getFirerate_level() : 'level ' + towers[id].getFirerate_level() + ' --> next level: ' + + towers[id].getUpgradeCosts()[1] + ' $'}</span>
        </div>
        <button class="btn" onclick="towerFirerateUpgrade(${id})">Fejlesztes</button>
    </div>

    <div class="rounded-2 d-flex justify-content-between align-items-center bg-1 p-5">
        <div class="d-flex align-items-center gap-5 w-75">
            <p class="m-0">Range: <span class="ms-5">${towers[id].getRange()}</span></p>
            <span>|</span>
            <span>${(towers[id].getRange_level() === 3) ? '<i>Maxed out - level </i>' + towers[id].getRange_level() : 'level ' + towers[id].getRange_level() + ' --> next level: ' + + towers[id].getUpgradeCosts()[2] + ' $'}</span>
        </div>
        <button class="btn" onclick="towerRangeUpgrade(${id})">Fejlesztes</button>
    </div>`;
}

function towerDamageUpgrade(id) {
    towers[id].upgradeDamage(penz);
    kijelzo_frissites();
    towerInfos(id);
}

function towerFirerateUpgrade(id) {
    towers[id].upgradeFirerate(penz);
    kijelzo_frissites();
    towerInfos(id);
}

function towerRangeUpgrade(id) {
    towers[id].upgradeRange(penz);
    kijelzo_frissites();
    towerInfos(id);
}

function toronyLerakas(i, j, elem) {
    document.querySelector(".towerInfos").classList.add("d-none");
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

    document.querySelectorAll(".build").forEach(b => b.remove());
    document.querySelectorAll(".tower-menu").forEach(tm => tm.remove());

    const doboz = document.createElement("div");
    doboz.classList.add("build", "d-flex", "gap-1");
    doboz.style.position = "absolute";
    doboz.style.zIndex = "1000";

    doboz.addEventListener("click", (e) => {
        e.stopPropagation();
        doboz.remove();
    });

    const epit = document.createElement("button");
    epit.classList.add("btn", "epit");
    epit.textContent = "Epit";

    epit.addEventListener("click", (e) => {
        e.stopPropagation();

        if (penz < 25) {
            alert("Nincs elég pénzed!");
            doboz.remove();
            return;
        }

        const infos = document.querySelector(".towerInfos");
        if (infos) {
            infos.innerHTML = "";
        }

        penz -= 25;
        map[i][j] = '4';

        const id = towers.length;
        const tower = new Tower(i, j, elem, id);
        towers.push(tower);

        kijelzo_frissites();
        doboz.remove();
    });

    const megse = document.createElement("button");
    megse.classList.add("btn", "megse");
    megse.textContent = "Mégse";
    megse.addEventListener("click", (e) => {
        e.stopPropagation();
        doboz.remove();
    });

    doboz.appendChild(epit);
    doboz.appendChild(megse);

    elem.appendChild(doboz);
}

var waypointok = [];
var enemyk = [];

function enemy_letrehozas() {
    var x = waypointok[0][1] + 0.5;
    var y = waypointok[0][0] + 0.5;
    var enemy = new Enemy(x, y, game_screen, wave_colors[(wave - 1) % wave_colors.length]);

    enemyk.push(enemy);
}

function vegmezon_van(enemy) {
    var sor = Math.floor(enemy.getY());
    var oszlop = Math.floor(enemy.getX());

    return String(map[sor][oszlop]) === "3";
}

function jatekVege() {
    clearInterval(jatek);
    jatek = null;

    document.querySelectorAll(".enemy").forEach(b => b.remove());
    document.querySelectorAll(".build").forEach(b => b.remove());
    document.querySelectorAll(".tower-menu").forEach(tm => tm.remove());

    enemyk.length = 0;
    waveIsOver = false;
    waveInfos[0][0] = 10;
    meghalt = 0;
    enemykDarabszama = 0;
    spawnSzamlalo = 1;
    wave = 1;
    elet = 15;
    penz = 100;

    var timer = document.querySelector(".timer");
    var hullam = document.querySelector(".hullam");
    timer.classList.remove("d-block");
    timer.classList.add("d-none");
    hullam.classList.remove("d-none");
    hullam.classList.add("d-block");

    kijelzo_frissites();
}

function kijelzo_frissites() {
    document.querySelector(".elet").innerHTML = elet;
    document.querySelector(".penz").innerHTML = penz;
    document.querySelector(".wave").innerHTML = wave;
}

map_generator(SOROK, OSZLOPOK);

waypointok = waypoint_calculator();

document.querySelector(".stop").addEventListener('click', () => {
    clearInterval(jatek);
    jatek = null;
    kijelzo_frissites();
})

var SEBESSEG = 100;
var SPAWN_IDO = .2;

var spawnSzamlalo = 1;
var jatek = null;
var tamad = null;

var waveIsOver = false;
var meghalt = 0;
var enemykDarabszama = 0;
var waveTimer = 0;


document.querySelector(".start").addEventListener("click", () => {
    if (jatek !== null) {
        return;
    }

    var ido = Date.now();
    var hullam = document.querySelector(".wavver");
    var timer = document.querySelector(".timer");

    jatek = setInterval(() => {
        var most = Date.now();
        var dt = Math.min((most - ido) / 1000, 0.05);
        ido = most;


        if (waveIsOver) {
            waveTimer -= dt;
            if (waveTimer <= 0) {
                waveIsOver = false;
                spawnSzamlalo = SPAWN_IDO;

                timer.classList.remove("d-block");
                timer.classList.add("d-none");
                hullam.classList.remove("d-none");
                hullam.classList.add("d-block");
            } else {
                timer.textContent = "Next wave in: " + Math.ceil(waveTimer) + "s"; // A Math.ceil() felkerekit a legkozelebbi teljes szamra, szoval 1.3 => 2
            }
        } else {
            spawnSzamlalo += dt;

            if (spawnSzamlalo >= SPAWN_IDO && enemykDarabszama < waveInfos[0][0]) {
                spawnSzamlalo = 0;

                enemy_letrehozas();
                enemykDarabszama++;

                kijelzo_frissites();
            }
        }

        for (let i = enemyk.length - 1; i >= 0; i--) {
        if (enemyk[i].isDead()) {
            enemyk[i].torol();
            enemyk.splice(i, 1);
            penz += 15;
            meghalt++;
            kijelzo_frissites();
        } else {
            enemyk[i].lep(SEBESSEG * dt);

            if (enemyk[i].veget_ert() || vegmezon_van(enemyk[i])) {
                enemyk[i].torol();
                enemyk.splice(i, 1);
                elet--;
                meghalt++;
                kijelzo_frissites();
            }
        }
    }

        for (let i = 0; i < towers.length; i++) {
            towers[i].setCooldown(towers[i].getCooldown() - dt);

            var range = towers[i].getRange() * towers[i].getRange();

            for (let j = 0; j < enemyk.length; j++) {
                var tavolsag = TowerRangeCalc(
                    towers[i].getX(),
                    towers[i].getY(),
                    enemyk[j].getX(),
                    enemyk[j].getY()
                );

                if (tavolsag <= range) {
                    tamadas(enemyk[j], towers[i]);
                }
            }
        }

        

        if (!waveIsOver && meghalt >= waveInfos[0][0]) {
            waveIsOver = true;
            wave++;  
            waveInfos[0][0] = Math.ceil(waveInfos[0][0] * 1.5);
            meghalt = 0;
            enemykDarabszama = 0;
            spawnSzamlalo = 0;
            waveTimer = 10;

            hullam.classList.remove("d-block");
            hullam.classList.add("d-none");
            timer.classList.remove("d-none");
            timer.classList.add("d-block");
            timer.textContent = "Next wave in: 10s";
        }

        
        if (elet <= 0 || wave > 5) {
            var uzenet = elet <= 0 ? "Veszettél!" : "Nyertél!"
            jatekVege();
            setTimeout(() => alert(uzenet), 0);
        }

    }, 16);
});

kijelzo_frissites();
