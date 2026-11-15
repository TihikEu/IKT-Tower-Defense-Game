const game_screen = document.querySelector(".game_screen");

var wave = 1;
var waveInfos = [
    [1, 1, 100]
];

var wave_colors = [
    ["#8a2e42", "#df3551"],
];

var elet = 15;
var penz = 1000;

var MUTATION_CHANCE = 0.2;
var enemyMutations = [RunnerEnemy, BruteEnemy, RegenEnemy];

var towerTypes = [
    { name: "Basic Tower", tower: Tower, cls: "tower-basic", cost: 25, desc: "Balanced damage" },
    { name: "Poison Tower", tower: PoisonTower, cls: "tower-poison", cost: 35, desc: "Damage over time" },
    { name: "Freeze Tower", tower: FreezeTower, cls: "tower-freeze", cost: 35, desc: "Slows enemies" },
    { name: "Cannon Tower", tower: CannonTower, cls: "tower-cannon", cost: 50, desc: "Splash damage" }
];

var pendingBuild = null;

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
        torony.attack(enemy);
        torony.setCooldown(torony.getFireRate());
    }
}

function towerInfos(id) {
    document.querySelector(".towerInfos").classList.remove("d-none");
    document.querySelector(".waveInfos").classList.add("d-none");
    document.querySelector(".gameInfos").classList.add("d-none");

    document.querySelector(".towerInfos").innerHTML =

    `<div class="w-100 d-flex justify-content-between align-items-center">
        <h2 class="m-0">${towers[id].typeName()}</h2>
        <button type="button" class="cancel fw-bold" onclick="closeTowerInfos()"><i class="bi bi-x"></i></button>
    </div>
    <div class="p-5 upg w-100">
        <div class="d-flex flex-column align-items-start gap-3 w-100 pb-5">
            <p class="m-0 w-50">Damage</p>
            <p class="m-0 w-50"><span>${towers[id].getDamage()}</span> Damage / Shot</p>
            <span class="w-50">${(towers[id].getDamage_level() !== 3) ? 'Level ' + towers[id].getDamage_level() + ' <i class="bi bi-arrow-right"></i> ' + (towers[id].getDamage_level() + 1) : 'Level ' + towers[id].getDamage_level() + ' <i class="bi bi-dash-lg"></i> Max'}</span>
        </div>
        <button type="button" class="upgradeButton w-100 fw-bold" onclick="towerDamageUpgrade(${id})">Damage ${(towers[id].getDamage_level() === 3) ? 'Maxed out' : 'upgrade <i class="bi bi-arrow-right"></i> ' + towers[id].getUpgradeCosts()[0] + ' $'}</button>
    </div>

    <div class="p-5 upg w-100">
        <div class="d-flex flex-column align-items-start gap-3 w-100 pb-5">
            <p class="m-0 w-50">Firerate</p>
            <p class="m-0 w-50"><span>${towers[id].getFireRate()} Fire / Sec</span></p>
            <span class="w-50">${(towers[id].getFirerate_level() !== 3) ? 'Level ' + towers[id].getFirerate_level() + ' <i class="bi bi-arrow-right"></i> ' + (towers[id].getFirerate_level() + 1) : 'Level ' + towers[id].getFirerate_level() + ' <i class="bi bi-dash-lg"></i> Max'}</span>
        </div>
        <button type="button" class="upgradeButton w-100 fw-bold" onclick="towerFirerateUpgrade(${id})">Firerate ${(towers[id].getFirerate_level() === 3) ? 'Maxed out' : 'upgrade <i class="bi bi-arrow-right"></i> ' + towers[id].getUpgradeCosts()[1] + ' $'}</button>
    </div>

    <div class="p-5 upg w-100">
        <div class="d-flex flex-column align-items-start gap-3 w-100 pb-5">
            <p class="m-0 w-50">Range</p>
            <p class="m-0 w-50"><span>${towers[id].getRange()}</span> Tiles range</p>
            <span class="w-50">${(towers[id].getRange_level() !== 3) ? 'Level ' + towers[id].getRange_level() + ' <i class="bi bi-arrow-right"></i> ' + (towers[id].getRange_level() + 1) : 'Level ' + towers[id].getRange_level() + ' <i class="bi bi-dash-lg"></i> Max'}</span>
        </div>
        <button type="button" class="upgradeButton w-100 fw-bold" onclick="towerRangeUpgrade(${id})">Range ${(towers[id].getRange_level() === 3) ? 'Maxed out' : 'upgrade <i class="bi bi-arrow-right"></i> ' + towers[id].getUpgradeCosts()[2] + ' $'}</button>
    </div>`;
}

function closeTowerInfos() {
    document.querySelector(".towerInfos").classList.add("d-none");
    document.querySelector(".waveInfos").classList.remove("d-none");
    document.querySelector(".gameInfos").classList.remove("d-none");
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

function openTowerPicker(i, j, elem) {
    pendingBuild = { i: i, j: j, elem: elem };

    var html = "";
    for (let k = 0; k < towerTypes.length; k++) {
        var t = towerTypes[k];
        html += `<button type="button" class="picker-card ${penz < t.cost ? "unaffordable" : ""}" data-index="${k}">
            <span class="choice-icon ${t.cls}"></span>
            <span class="picker-name fw-bold">${t.name}</span>
            <span class="picker-desc">${t.desc}</span>
            <span class="picker-cost">${t.cost} $</span>
        </button>`;
    }

    document.querySelector(".picker-grid").innerHTML = html;
    document.querySelector(".tower-picker").classList.add("open");
}

function closeTowerPicker() {
    pendingBuild = null;
    document.querySelector(".tower-picker").classList.remove("open");
}

function buildTower(index) {
    if (pendingBuild === null) {
        return;
    }

    var type = towerTypes[index];

    if (penz < type.cost) {
        alert("Nincs elég pénzed!");
        return;
    }

    var i = pendingBuild.i;
    var j = pendingBuild.j;
    var elem = pendingBuild.elem;

    if (map[i][j] === '4') {
        closeTowerPicker();
        return;
    }

    var infos = document.querySelector(".towerInfos");
    if (infos) {
        infos.innerHTML = "";
    }

    penz -= type.cost;
    map[i][j] = '4';

    var id = towers.length;
    var tower = new type.tower(i, j, elem, id);
    towers.push(tower);

    kijelzo_frissites();
    closeTowerPicker();
}

document.querySelector(".tower-picker").addEventListener("click", (e) => {
    var card = e.target.closest(".picker-card");

    if (card) {
        buildTower(Number(card.dataset.index));
        return;
    }

    if (e.target.classList.contains("tower-picker") || e.target.closest(".picker-close")) {
        closeTowerPicker();
    }
});

function toronyLerakas(i, j, elem) {
    document.querySelector(".towerInfos").classList.add("d-none");
    document.querySelector(".gameInfos").classList.remove("d-none");
    document.querySelector(".waveInfos").classList.remove("d-none");
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
    epit.textContent = "Build";

    epit.addEventListener("click", (e) => {
        e.stopPropagation();

        if (penz < 25) {
            alert("Nincs elég pénzed!");
            doboz.remove();
            return;
        }

        doboz.remove();
        openTowerPicker(i, j, elem);
    });

    const megse = document.createElement("button");
    megse.classList.add("btn", "megse");
    megse.textContent = "Cancel";
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
    var enemy;

    if (Math.random() < MUTATION_CHANCE) {
        var Mutation = enemyMutations[Math.floor(Math.random() * enemyMutations.length)];
        enemy = new Mutation(x, y, game_screen);
    } else {
        enemy = new Enemy(x, y, game_screen, wave_colors[(wave - 1) % wave_colors.length]);
    }

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

    closeTowerPicker();

    document.querySelectorAll(".enemy").forEach(b => b.remove());
    document.querySelectorAll(".build").forEach(b => b.remove());
    document.querySelectorAll(".tower-menu").forEach(tm => tm.remove());
    document.querySelectorAll(".tower").forEach(t => t.remove());

    for (let i = 0; i < SOROK; i++) {
        for (let j = 0; j < OSZLOPOK; j++) {
            if (map[i][j] === '4') {
                map[i][j] = '0';
            }
        }
    }
    towers.length = 0;
    enemyk.length = 0;

    waveIsOver = false;
    waveInfos[0][0] = 10;
    meghalt = 0;
    enemykDarabszama = 0;
    spawnSzamlalo = 1;
    waveTimer = 0;
    wave = 1;
    elet = 15;
    penz = 1000;

    var timer = document.querySelector(".timer");
    var hullam = document.querySelector(".wavver");
    timer.classList.remove("d-block");
    timer.classList.add("d-none");
    hullam.classList.remove("d-none");
    hullam.classList.add("d-block");

    closeTowerInfos();
    document.querySelector(".towerInfos").innerHTML = "";
    kijelzo_frissites();
}

function showResultModal(won) {
    var modal = document.querySelector(".result-modal");
    modal.classList.toggle("won", won);
    modal.classList.toggle("lost", !won);
    modal.querySelector(".result-title").textContent = won ? "You won!" : "You lost!";
    modal.querySelector(".result-text").textContent = won ? "You defended your base through all 5 waves." : "The enemies got through your defenses.";
    modal.classList.add("open");
}

function closeResultModal() {
    document.querySelector(".result-modal").classList.remove("open");
}

document.querySelector(".result-modal").addEventListener("click", (e) => {
    if (e.target.classList.contains("result-modal") || e.target.closest(".result-close")) {
        closeResultModal();
    }
});

function kijelzo_frissites() {
    document.querySelector(".elet").innerHTML = elet;
    document.querySelector(".penz").innerHTML = penz;
    document.querySelector(".wave").innerHTML = wave;

    document.querySelector(".progress-bar-striped").style.width = wave * 20 + "%";

    document.querySelector(".wave-enemies").innerHTML = waveInfos[0][0];
    document.querySelector(".wave-enemiesSpeeds").innerHTML = waveInfos[0][1];
    document.querySelector(".wave-enemiesHealts").innerHTML = waveInfos[0][2] + " hp";
    document.querySelector(".wave-enemiesSpawnRate").innerHTML = SPAWN_IDO + " s";
}

map_generator(SOROK, OSZLOPOK);

waypointok = waypoint_calculator();

document.querySelector(".stop").addEventListener('click', () => {
    clearInterval(jatek);
    jatek = null;
    kijelzo_frissites();
});

var SEBESSEG = 1;
var SPAWN_IDO = 1;

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
                timer.textContent = "Next wave in: " + Math.ceil(waveTimer) + "s";
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
                penz += enemyk[i].getReward();
                enemyk[i].torol();
                enemyk.splice(i, 1);
                meghalt++;
                kijelzo_frissites();
            } else {
                enemyk[i].update(dt);
                enemyk[i].lep(SEBESSEG * dt);

                if (!enemyk[i].isDead() && (enemyk[i].veget_ert() || vegmezon_van(enemyk[i]))) {
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

        kijelzo_frissites();

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
            var won = elet > 0;
            jatekVege();
            setTimeout(() => showResultModal(won), 0);
        }

    }, 16);
});

kijelzo_frissites();
