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
  const minionArr = [
    zombie("Bob"),
    zombie("Jim"),
    zombie("Frank"),
    zombie("Billy"),
  ];

  const steve = minions.skeleton("Steve");

  console.log(steve);

  batchAttack(minionArr, steve);
}

runTests();
