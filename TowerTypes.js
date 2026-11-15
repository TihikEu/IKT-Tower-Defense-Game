class PoisonTower extends Tower {
    typeClass() {
        return "tower-poison";
    }

    typeName() {
        return "Poison Tower";
    }

    attack(enemy) {
        enemy.takeDamage(this.getDamage() * 0.25);
        enemy.applyPoison(this.getDamage() * 0.5, 3);
    }
}

class FreezeTower extends Tower {
    typeClass() {
        return "tower-freeze";
    }

    typeName() {
        return "Freeze Tower";
    }

    attack(enemy) {
        enemy.takeDamage(this.getDamage() * 0.6);
        enemy.applySlow(0.5, 2);
    }
}

class CannonTower extends Tower {
    typeClass() {
        return "tower-cannon";
    }

    typeName() {
        return "Cannon Tower";
    }

    attack(enemy) {
        enemy.takeDamage(this.getDamage() * 0.8);

        for (let i = 0; i < enemyk.length; i++) {
            const other = enemyk[i];

            if (other !== enemy && !other.isDead()) {
                const dx = other.getX() - enemy.getX();
                const dy = other.getY() - enemy.getY();

                if (dx * dx + dy * dy <= 1) {
                    other.takeDamage(this.getDamage() * 0.5);
                }
            }
        }
    }
}
