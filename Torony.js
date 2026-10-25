class Tower {
    #x;
    #y;

    #tile;
    #id;

    #level = 1;
    #damage = 15;
    #element;

    #range = 2;
    #fireRate = 1; // lövés / másodperc
    #cooldown = 0;
    #rangeElement;

    #levelCosts = [
        [50, 75]
    ];

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

    getLevel() {
        return this.#level;
    }

    getDamage() {
        return this.#damage;
    }

    getRange() {
        return this.#range;
    }

    upgrade() {
        if (this.#level >= 3) {
            alert("Már max level ez a torony!");
            return;
        }

        const cost = this.#levelCosts[0][this.#level - 1];

        if (penz < cost) {
            alert("Nincs elég pénzed a fejlesztéshez!");
            return;
        }

        penz -= cost;
        this.#level++;

        this.#damage += 5;
        this.#range += 0.5;

        this.#element.classList.remove(
            "level-1",
            "level-2",
            "level-3"
        );

        this.#element.classList.add(
            "level-" + this.#level
        );

        kijelzo_frissites();
    }

    createElement() {
        this.#element = document.createElement("div");

        this.#element.classList.add(
            "tower",
            "level-" + this.#level
        );

        this.#element.addEventListener("click", () => {
            towerUpgrade(this.#id);
        });

        this.#tile.appendChild(this.#element);
    }
}
