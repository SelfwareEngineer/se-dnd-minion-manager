"use strict";
import "./style.css";
import * as minions from "./modules/minions.js";
import * as enemy from "./modules/enemy.js";

let minionArr = [];

function spawnZombie(name) {
  minionArr.push(minions.zombie(name));
}

function spawnSkeleton(name) {
  minionArr.push(minions.skeleton(name));
}

function batchAttack(minionArr, target) {
  let damageRecord = {};
  let totalDamage = {};

  for (const minion of minionArr) {
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
  const zombie = minions.zombie;
  const minionArr = [];

  for (let i = 0; i < 8; i++) {
    minionArr.push(zombie("Zombie" + (i + 1)));
  }

  const steve = enemy.enemy("Steve");

  console.log(steve);

  batchAttack(minionArr, steve);
}

runTests();
