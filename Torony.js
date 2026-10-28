class Tower {
    #x;
    #y;

    #tile;
    #id;

    #damage_level = 1;
    #damage = 15;

    #firerate_level = 1;
    #firerate = 1.5;

    #range_level = 1;
    #range = 1.5;

    #cooldown = 0;

    #element;

    #value = 15;

    #upgradesCosts = [10, 15, 20];

    constructor(x, y, tile, id) {
        this.setX(x);
        this.setY(y);
        this.setTile(tile);
        this.setId(id);

        this.createElement();
    }

    setX(x) {
        this.#x = x;
    }

    setY(y) {
        this.#y = y;
    }

    setTile(tile) {
        this.#tile = tile;
    }

    setId(id) {
        this.#id = id;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getDamage() {
        return this.#damage;
    }
    getDamage_level() {
        return this.#damage_level;
    }

    getRange() {
        return this.#range;
    }
    getRange_level() {
        return this.#range_level;
    }

    getFireRate() {
        return this.#firerate;
    }
    getFirerate_level() {
        return this.#firerate_level;
    }

    setCooldown(cd) {
        if (cd < 0) {
            this.#cooldown = 0;
        } else {
            this.#cooldown = cd;
        }
    }

    getUpgradeCosts(){
        return this.#upgradesCosts;
    }

    getCooldown() {
        return this.#cooldown;
    }

    upgradeDamage() {
        const cost = this.#upgradesCosts[0];

        if (penz < cost) {
            alert("Nincs eleg penzed ehez a fejleszteshez!");
            return;
        }

        if (this.#damage_level >= 3) {
            alert("Ez a fejlesztes mar maxos! (lvl 3)");
            return
        }

        this.#element.classList.remove(
            "damage_level-" + this.#damage_level
        )

        this.#damage += 5;
        this.#damage_level += 1;

        this.#value += (cost - 3);

        this.#element.classList.add(
            "damage_level-" + this.#damage_level
        )

        penz -= cost;

        this.#upgradesCosts[0] += 5;
    }

    upgradeFirerate() {
        const cost = this.#upgradesCosts[2];

        if (penz < cost) {
            alert("Nincs eleg penzed ehez a fejleszteshez!");
            return;
        }

        if (this.#firerate_level >= 3) {
            alert("Ez a fejlesztes mar maxos! (lvl 3)");
            return
        }

        this.#element.classList.remove(
            "firerate_level-" + this.#firerate_level
        )

        this.#firerate -= 0.25;
        this.#firerate_level += 1;

        this.#value += (cost - 3);

        this.#element.classList.add(
            "firerate_level-" + this.#firerate_level
        )

        penz -= cost;

        this.#upgradesCosts[1] += 5;
    }

    upgradeRange() {
        const cost = this.#upgradesCosts[1];

        if (penz < cost) {
            alert("Nincs eleg penzed ehez a fejleszteshez!");
            return;
        }

        if (this.#range_level >= 3) {
            alert("Ez a fejlesztes mar maxos! (lvl 3)");
            return
        }

        this.#element.classList.remove(
            "range_level-" + this.#range_level
        )

        this.#range += 0.25;
        this.#range_level += 1;

        this.#value += (cost - 3);

        this.#element.classList.add(
            "range_level-" + this.#range_level
        )

        penz -= cost;

        this.#upgradesCosts[2] += 5;
    }

    createElement() {
        this.#element = document.createElement("div");

        this.#element.classList.add(
            "tower",
            "damage_level-" + this.#damage_level,
            "firerate_level-" + this.#firerate_level,
            "range_level-" + this.#range_level
        );

        this.#tile.appendChild(this.#element);

        this.#element.addEventListener("click", (e) => {
            e.stopPropagation();

            document.querySelector(".tower-menu")?.remove();
            document.querySelectorAll(".build").forEach(b => b.remove());

            const infos = document.querySelector(".towerInfos");
            if (infos) {
                infos.innerHTML = "";
            }

            const doboz = document.createElement("div");
            doboz.classList.add("tower-menu", "d-flex", "gap-1");
            doboz.style.position = "absolute";
            doboz.style.zIndex = "1000";

            doboz.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            const fejleszt = document.createElement("button");
            fejleszt.classList.add(
                "btn",
                "btn-success",
                "btn-sm",
                "fejleszt"
            );
            fejleszt.textContent = "Fejlesztés";

            fejleszt.addEventListener("click", (e) => {
                e.stopPropagation();
                doboz.remove();

                towerInfos(this.#id);
            });

            const torles = document.createElement("button");
            torles.classList.add(
                "btn",
                "btn-danger",
                "btn-sm",
                "torles"
            );
            torles.textContent = "Törlés";

            torles.addEventListener("click", (e) => {
                e.stopPropagation();

                doboz.remove();

                const infos = document.querySelector(".towerInfos");
                if (infos) {
                    infos.innerHTML = "";
                }

                this.#element.remove();

                const index = towers.indexOf(this);

                if (index !== -1) {
                    towers.splice(index, 1);
                }

                map[this.#x][this.#y] = "0";

                penz += 12;

                kijelzo_frissites();
            });

            doboz.append(fejleszt, torles);
            this.#tile.appendChild(doboz);
        });

        kijelzo_frissites();
    }
}
