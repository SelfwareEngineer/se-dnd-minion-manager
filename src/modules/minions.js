"use strict";
import * as dice from "./dice.js";

const minion = () => ({
  makeAttack: function (attack, target) {
    const attackRoll = getAttackRoll(this, attack);

    if (attackRoll.total < target.minArmorClass) {
      console.log(this.name + " missed.");
      return;
    } else if (attackRoll.total >= target.maxArmorClass) {
      return getDamage(attack.damage);
    } else {
      let isAHit = prompt(
        "Does a " + attackRoll.total + " hit? (y/n)",
      ).toLowerCase();
      while (!["y", "n"].includes(isAHit)) {
        isAHit = prompt(
          'Please answer with "y" or "n". Does a ' +
            attackRoll.total +
            " hit? (y/n)",
        );
      }

      if (isAHit === "y") {
        target.maxArmorClass = attackRoll.total;
        return getDamage(attack.damage);
      } else {
        target.minArmorClass = attackRoll.total + 1;
        return null;
      }
    }
  },

  makeAbilityCheck: function (stat, isProficient) {
    let bonus = getModifier(this.stats[stat]);

    if (isProficient) {
      bonus += this.proficiency;
    }

    return dice.roll("1d20" + parseBonus(bonus));
  },

  heal: function (damageHealed) {
    this.currentHP += damageHealed;
    if (this.currentHP > this.maxHP) {
      this.currentHP = this.maxHP;
    }
  },

  takeDamage: function (damageResult) {
    let totalDamage = 0;
    for (const damageType in damageResult) {
      totalDamage += damageResult[damageType].total;
    }
    this.currentHP -= totalDamage;
    this.checkIfDead();
  },

  checkIfDead: function () {
    if (this.currentHP <= 0) {
      console.log(this.name + " has died.");
      this.dead = true;
    }
  },
});

const zombie = (name) => {
  const hpRoll = dice.roll("3d8+9");
  console.log(
    `${name} has spawned with ${hpRoll.total} hit points (${hpRoll.rolls} + ${hpRoll.bonus})`,
  );

  let newZombie = {
    id: "z-" + getMinionID(),
    name,
    armorClass: 8,
    maxHP: hpRoll.total,
    currentHP: hpRoll.total,
    proficiency: 2,
    speed: 20,
    stats: {
      strength: 13,
      dexterity: 6,
      constitution: 16,
      intelligence: 3,
      wisdom: 6,
      charisma: 5,
    },
    attacks: {
      slam: {
        type: "strength",
        isProficient: true,
        damage: {
          bludgeoning: "1d6+1",
        },
      },
    },
    selectedAttack: "slam",
    features: {
      undeadFortitude:
        "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
    },

    takeDamage: function (damageResult) {
      let totalDamage = 0;

      for (const damageType in damageResult) {
        // this might be buggy, if so maybe double == will work?
        if (damageType === "poison") {
          console.log(this.name + " is immune to poison!");
        } else {
          totalDamage += damageResult[damageType].total;
        }
      }

      this.currentHP -= totalDamage;
      this.checkIfDead(totalDamage);
    },

    checkIfDead: function (totalDamage) {
      if (this.currentHP <= 0) {
        const saveDC = totalDamage + 5;
        const save = this.makeAbilityCheck("constitution", false);
        if (save >= saveDC) {
          this.currentHP = 1;
        } else {
          console.log(this.name + " has died.");
          this.dead = true;
        }
      }
    },
  };

  return Object.assign(minion(), newZombie);
};

const skeleton = (name) => {
  const hpRoll = dice.roll("2d8+4");
  console.log(
    `${name} has spawned with ${hpRoll.total} hit points (${hpRoll.rolls} + ${hpRoll.bonus})`,
  );

  let newSkeleton = {
    id: "s-" + getMinionID(),
    name,
    armorClass: 13,
    maxHP: hpRoll.total,
    currentHP: hpRoll.total,
    proficiency: 2,
    speed: 30,
    stats: {
      strength: 10,
      dexterity: 14,
      constitution: 15,
      intelligence: 6,
      wisdom: 8,
      charisma: 5,
    },
    attacks: {},

    takeDamage: function (damageResult) {
      let totalDamage = 0;

      for (const damageType in damageResult) {
        // this might be buggy, if so maybe double == will work?
        if (damageType === "poison") {
          console.log(this.name + " is immune to poison!");
        } else if (damageType === "bludgeoning") {
          console.log(this.name + " is vulnerable to bludgeoning!");
          totalDamage += damageResult[damageType].total * 2;
        } else {
          totalDamage += damageResult[damageType].total;
        }
      }

      this.currentHP -= totalDamage;
      this.checkIfDead(totalDamage);
    },
  };

  return Object.assign(minion(), newSkeleton);
};

function getMinionID() {
  return Date.now() + (Math.random() * 2000 - 1000);
}

function getAttackRoll(entity, attack) {
  const attackModifier = getModifier(entity.stats[attack.type]);
  let totalBonus;

  if (attack.isProficient) {
    totalBonus = attackModifier + entity.proficiency;
  } else {
    totalBonus = attackModifier;
  }

  return dice.roll("1d20" + parseBonus(totalBonus));
}

function getModifier(abilityScore) {
  return Math.floor((abilityScore - 10) / 2);
}

function getDamage(damageStats) {
  let damageResult = {};
  for (const damageType in damageStats) {
    damageResult[damageType] = dice.roll(damageStats[damageType]);
  }
  return damageResult;
}

function getResistantDamage(num) {
  return Math.floor(num / 2);
}

function parseBonus(bonusNum) {
  let bonusStr;

  if (bonusNum >= 0) {
    bonusStr = "+" + bonusNum.toString();
  } else {
    bonusStr = bonusNum.toString();
  }

  return bonusStr;
}

export { zombie, skeleton };
