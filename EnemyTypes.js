class RunnerEnemy extends Enemy {
    constructor(x, y, game_screen) {
        super(x, y, game_screen, ["#8a7a1e", "#ffe14a"]);
    }

    typeClass() {
        return "enemy-runner";
    }

    baseHp() {
        return 60;
    }

    speedMultiplier() {
        return 1.8;
    }

    getReward() {
        return 20;
    }
}

class BruteEnemy extends Enemy {
    constructor(x, y, game_screen) {
        super(x, y, game_screen, ["#3a3f4a", "#9aa3b0"]);
    }

    typeClass() {
        return "enemy-brute";
    }

    baseHp() {
        return 300;
    }

    speedMultiplier() {
        return 0.6;
    }

    getReward() {
        return 30;
    }
}

class RegenEnemy extends Enemy {
    constructor(x, y, game_screen) {
        super(x, y, game_screen, ["#8a1e6b", "#ff5bd0"]);
    }

    typeClass() {
        return "enemy-regen";
    }

    baseHp() {
        return 150;
    }

    getReward() {
        return 25;
    }

    onUpdate(dt) {
        this.heal(8 * dt);
    }
}
