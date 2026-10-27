class Tower {
    #x;
    #y;

    #tile;
    #id;

    #level = 1;
    #damage = 10;
    #fireRate = 1;
    #cooldown = 0;

    #element;

    #range = 2;

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

    getFireRate(){
        return this.#fireRate;
    }

    setCooldown(cd){
        if(cd < 0){
            this.#cooldown = 0;
        } else {
            this.#cooldown = cd;
        }
    }

    getCooldown(){
        return this.#cooldown;
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
        this.#element.classList.add("tower", "level-" + this.#level);

        
        this.#tile.appendChild(this.#element);

        this.#element.addEventListener("click", (e) => {
            e.stopPropagation(); 

            document.querySelector(".tower-menu")?.remove();

            var doboz = document.createElement("div");
            doboz.classList.add("tower-menu", "d-flex", "gap-1");
            doboz.style.position = "absolute";
          

            doboz.addEventListener("click", (e) => e.stopPropagation());

            var fejleszt = document.createElement("button");
            fejleszt.classList.add("btn", "btn-success", "btn-sm", "fejleszt");
            fejleszt.textContent = "Fejleszt";
            fejleszt.addEventListener("click", (e) => {
                e.stopPropagation();
                this.upgrade();
            });

            var torles = document.createElement("button");
            torles.classList.add("btn", "btn-danger", "btn-sm", "torles");
            torles.textContent = "Törlés";
            torles.addEventListener("click", (e) => {
                e.stopPropagation();
                doboz.remove();
                this.#element.remove();
                var index = towers.indexOf(this);
                if (index !== -1) {
                    towers.splice(index, 1);
                }

                map[this.#x][this.#y] = '0';

                penz += 12;
                kijelzo_frissites();
            });

            doboz.append(fejleszt, torles);
            this.#tile.appendChild(doboz);
        });

        kijelzo_frissites();
    }
}
