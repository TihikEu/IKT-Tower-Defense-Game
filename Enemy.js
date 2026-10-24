class Enemy {
    #x;
    #y;
    #cel;

    #hitbox_color;

    #game_screen;

    #enemy;     // a külső elem (ez mozog a pályán)
    #element;   // a hitbox
    #hp_bar;    // az életcsík

    #hp;
    #max_hp;

    constructor(x, y, game_screen, hitbox_color) {
        this.setX(x);
        this.setY(y);
        this.setGame_screen(game_screen);
        this.setHitbox_color(hitbox_color);

        this.#cel = 1;
        this.#max_hp = 100;
        this.#hp = this.#max_hp;

        this.createElement();
        this.draw();
    }

    setX(x) {
        this.#x = x;
    }
    getX() {
        return this.#x;
    }

    setY(y) {
        this.#y = y;
    }
    getY() {
        return this.#y;
    }

    setGame_screen(game_screen) {
        this.#game_screen = game_screen;
    }

    setHitbox_color(hitbox_color){
        this.#hitbox_color = hitbox_color;
    }

    getHitbox_color(){
        return this.#hitbox_color;
    }

    createElement() {
        this.#enemy = document.createElement("div");
        this.#enemy.classList.add("enemy");

        this.#element = document.createElement("div");
        this.#element.classList.add("enemy_hitbox");
        this.#element.style.background = this.getHitbox_color();

        this.#hp_bar = document.createElement("div");
        this.#hp_bar.classList.add("enemy_hp");

        this.#enemy.appendChild(this.#element);
        this.#enemy.appendChild(this.#hp_bar);

        this.#game_screen.appendChild(this.#enemy);
    }

    draw() {
        this.#enemy.style.left = (this.#x / OSZLOPOK * 100) + "%";
        this.#enemy.style.top = (this.#y / SOROK * 100) + "%";
    }

    lep(lepes) {
        while (lepes > 0 && this.#cel < waypointok.length) {
            var celX = waypointok[this.#cel][1] + 0.5;
            var celY = waypointok[this.#cel][0] + 0.5;

            var dx = celX - this.#x;
            var dy = celY - this.#y;
            var tavolsag = Math.sqrt(dx * dx + dy * dy);

            if (lepes >= tavolsag) {
                this.#x = celX;
                this.#y = celY;
                this.#cel++;
                lepes -= tavolsag;
            } else {
                this.#x += dx / tavolsag * lepes;
                this.#y += dy / tavolsag * lepes;
                lepes = 0;
            }
        }

        this.draw();
    }

    veget_ert() {
        return this.#cel >= waypointok.length;
    }

    torol() {
        this.#enemy.remove();
    }
}
