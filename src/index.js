"use strict";
import "./style.css";
import * as minions from "./modules/minions.js";
import * as enemy from "./modules/enemy.js";

let allMinions = {};
let allEnemies = {};
let selectedMinions = [];
let minionCount = 0;

function spawnMinion(type, name) {
  const newMinion = minions[type](name);
  allMinions[newMinion.id] = newMinion;
  updateMinionList();
}

function spawnEnemy(name) {
  const newEnemy = enemy.enemy(name);
  allEnemies[newEnemy.id] = newEnemy;
}

function updateMinionList() {
  const minionList = document.querySelector('[data-id="minionList"]');

  while (minionList.hasChildNodes()) {
    minionList.removeChild(minionList.firstChild);
  }

  for (const minionID in allMinions) {
    const minion = allMinions[minionID];

    const minionDisplay = document.createElement("div");
    minionDisplay.classList += "minion";
    minionList.appendChild(minionDisplay);

    const minionName = document.createElement("h3");
    minionName.textContent = minion.name;
    minionDisplay.appendChild(minionName);

    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.textContent = "Select";
    selectButton.classList += "select-button";
    selectButton.dataset.id = "selectButton";
    selectButton.addEventListener("click", () => {
      selectMinion(minion.name);
      selectButton.style.backgroundColor = "hsl(91, 25%, 31%)";
    });
    minionDisplay.appendChild(selectButton);
  }
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

function selectMinion(minionName) {
  selectedMinions.push(minionName);
  console.log("Selected minions: " + selectedMinions);
}

function clearMinionSelection() {
  selectedMinions = [];
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

// function runTests() {
//   for (let i = 0; i < 8; i++) {
//     const zombieName = "Zombie" + (i + 1);
//     spawnMinion("zombie", zombieName);
//   }
//
spawnEnemy("testEnemy");
//   const testEnemy = getEnemyID("testEnemy");
//
//   console.log(testEnemy);
// }

const spawnZombieButton = document.querySelector('[data-id="spawnZombie"]');
const spawnSkeletonButton = document.querySelector('[data-id="spawnSkeleton"]');
const resetEnemyButton = document.querySelector('[data-id="resetEnemy"]');
const resetSelectionButton = document.querySelector(
  '[data-id="resetSelection"]',
);
const attackButton = document.querySelector('[data-id="batchAttack"]');

spawnZombieButton.addEventListener("click", () => {
  minionCount++;
  spawnMinion("zombie", "Zombie" + minionCount);
});

spawnSkeletonButton.addEventListener("click", () => {
  minionCount++;
  spawnMinion("skeleton", "Skeleton" + minionCount);
});

// resetEnemyButton.addEventListener("click", resetEnemy);

resetSelectionButton.addEventListener("click", clearMinionSelection);

attackButton.addEventListener("click", () => {
  const testEnemy = allEnemies[getEnemyID("testEnemy")];
  batchAttack(testEnemy);
});

// runTests();
