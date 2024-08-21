"use strict";
import "./style.css";
import * as minions from "./modules/minions.js";

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

  for (let i = 0; i < 100; i++) {
    minionArr.push(zombie("Zombie" + (i + 1)));
  }

  const steve = minions.enemy("Steve");

  console.log(steve);

  batchAttack(minionArr, steve);
}

runTests();
