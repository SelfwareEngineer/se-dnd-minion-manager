"use strict";
import * as dice from "./dice.js";

const minion = () => ({
  makeAttack: function (attack, target) {
    const attackRoll = getAttackRoll(this, attack);

    if (attackRoll < target.minArmorClass) {
      console.log(this.name + " missed.");
      return;
    } else if (attackRoll >= target.maxArmorClass) {
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
        return;
      }
    }
  },

  makeAbilityCheck: function (stat, isProficient) {
    let bonus = getModifier(this[stat]);

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

  takeDamage: function (damageTaken) {
    this.currentHP -= damageTaken;
    if (this.currentHP <= 0) {
      this.die();
    }
  },

  die: function () {
    this.dead = true;
  },
});

const zombie = (name) => {
  const maxHP = dice.roll("3d8+9");

  let newZombie = {
    id: "z-" + getMinionID(),
    name,
    armorClass: 8,
    maxHP,
    currentHP: maxHP,
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
    features: {
      undeadFortitude:
        "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
    },

    takeDamage: function (damageTaken) {
      this.currentHP -= damageTaken;
      if (this.currentHP <= 0) {
        const saveDC = damageTaken + 5;
        const save = this.makeAbilityCheck("constitution", false);
        if (save >= saveDC) {
          this.currentHP = 1;
        } else {
          this.die();
        }
      }
    },
  };

  return Object.assign(minion(), newZombie);
};

function getMinionID() {
  return Date.now() + (Math.random() * 2000 - 1000);
}

function getAttackRoll(entity, attack) {
  const attackModifier = getModifier(entity[attack.type]);
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

function getDamage(damageObj) {
  let result = {};
  for (const damageType in damageObj) {
    result[damageType] = dice.roll(damageObj[damageType]);
  }
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

export { zombie };
