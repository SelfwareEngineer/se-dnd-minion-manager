"use strict";
import "./style.css";
import * as minions from "./modules/minions.js";
import * as enemy from "./modules/enemy.js";

const allMinions = {};
const allEnemies = {};

function spawnMinion(type, name) {
  const newMinion = minions[type](name);
  allMinions[newMinion.id] = newMinion;
}

function spawnEnemy(name) {
  const newEnemy = enemy.enemy(name);
  allEnemies[newEnemy.id] = newEnemy;
}

function batchAttack(allMinions, target) {
  let damageRecord = {};
  let totalDamage = {};

  for (const minionID in allMinions) {
    const minion = allMinions[minionID];
    const minionDamage = minion.makeAttack(
      minion.attacks[minion.selectedAttack],
      target,
    );

    if (minionDamage) {
      damageRecord[minion.name] = minionDamage;

      for (const damageType in minionDamage) {
        if (!totalDamage[damageType]) {
          totalDamage[damageType] = 0;
        }

        totalDamage[damageType] += minionDamage[damageType].total;
      }
    } else {
      damageRecord[minion.name] = "miss";
    }
  }

  console.log(damageRecord);
  console.log(totalDamage);
}

function runTests() {
  for (let i = 0; i < 8; i++) {
    spawnMinion("zombie", "Zombie" + (i + 1));
  }

  const steve = enemy.enemy("Steve");

  console.log(steve);

  batchAttack(allMinions, steve);
}

runTests();
