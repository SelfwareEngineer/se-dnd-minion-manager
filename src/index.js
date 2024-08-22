"use strict";
import "./style.css";
import * as minions from "./modules/minions.js";
import * as enemy from "./modules/enemy.js";

const allMinions = {};
const allEnemies = {};
const selectedMinions = [];

function spawnMinion(type, name) {
  const newMinion = minions[type](name);
  allMinions[newMinion.id] = newMinion;
}

function spawnEnemy(name) {
  const newEnemy = enemy.enemy(name);
  allEnemies[newEnemy.id] = newEnemy;
}

function getMinionID(name) {
  for (const minionID in allMinions) {
    const minion = allMinions[minionID];
    if (minion.name === name) {
      return minionID;
    }
  }
}

function getEnemyID(name) {
  for (const enemyID in allEnemies) {
    const enemy = allEnemies[enemyID];
    if (enemy.name === name) {
      return enemyID;
    }
  }
}

function selectMinions(minionArr) {
  selectedMinions = [];
  for (const minion of minionArr) {
    selectedMinions.push(minion);
  }
  console.log("Selected minions: " + selectedMinions);
}

function batchAttack(target) {
  let damageRecord = {};
  let totalDamage = {};

  for (const minionName of selectedMinions) {
    const minion = allMinions[getMinionID(minionName)];
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
    const zombieName = "Zombie" + (i + 1);
    spawnMinion("zombie", zombieName);
    selectedMinions.push(zombieName);
  }

  spawnEnemy("steve");
  const steve = getEnemyID("steve");

  console.log(steve);

  batchAttack(allEnemies[getEnemyID("steve")]);
}

runTests();
