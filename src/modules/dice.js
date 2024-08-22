"use strict";

//TODO:
// - refactor this to account for d20 rolls (adv and dis)
//      - Probably split this up into more functions to keep the code neat
function roll(expressionStr, isCrit = false, rollType = null) {
  const expressionObj = parseExpressionStr(expressionStr);

  if (expressionObj.numberOfSides === 20 && expressionObj.numberOfDice > 1) {
    throw new Error(
      "Error: dice.roll() only accepts 1 d20 at a time. For advantage and disadvantage, use rollAdvantage() and rollDisadvantage().",
    );
  }

  if (isCrit && rollType) {
    throw new Error(
      "Error: a roll at advantage or disadvantage can't also be a crit.",
    );
  }

  if (isCrit) {
    expressionObj.numberOfDice *= 2;
  }

  if (rollType) {
    return getRollRecordAdvantage(expressionObj, rollType);
  } else {
    return getRollRecordStandard(expressionObj);
  }
}

function getRollRecordStandard(expressionObj) {
  let rolls = [];
  const bonus = expressionObj.bonus;
  let total = 0;

  for (let i = 0; i < expressionObj.numberOfDice; i++) {
    const result = Math.ceil(Math.random() * expressionObj.numberOfSides);
    rolls.push(result);
    total += result;
  }

  total += bonus;
  let rollRecord = {
    rolls,
    bonus,
    total,
  };

  if (expressionObj.numberOfSides === 20) {
    const isCrit = rolls[0] === 20;
    rollRecord.isCrit = isCrit;
  }

  return rollRecord;
}

function getRollRecordAdvantage(expressionObj, rollType) {
  const roll1 = getRollRecordStandard(expressionObj);
  const roll2 = getRollRecordStandard(expressionObj);

  const combinedRolls = [roll1.rolls[0], roll2.rolls[0]];
  // Doesn't matter which, I just picked roll1 because it's first
  const bonus = roll1.bonus;
  let total;
  let isCrit;

  if (["a", "advantage"].includes(rollType)) {
    total = Math.max(...combinedRolls) + bonus;
    isCrit = combinedRolls.includes(20);
  } else if (["d", "disadvantage"].includes(rollType)) {
    total = Math.min(...combinedRolls) + bonus;
    isCrit = combinedRolls.every((i) => i === 20);
  } else {
    throw new Error(
      'Error: getRollRecordAdvantage can only be called with a rollType of "a", "advantage", "d", or "disadvantage".',
    );
  }

  return {
    rolls: combinedRolls,
    bonus,
    total,
    isCrit,
  };
}

function parseExpressionStr(expressionStr) {
  const regex = /^(\d*)d(\d+)([+-]\d+)?$/;
  const match = expressionStr.match(regex);

  if (!match) {
    throw new Error("Invalid dice expression");
  }

  const [_, numberOfDice, numberOfSides, bonus] = match;

  return {
    numberOfDice: numberOfDice ? Number(numberOfDice) : 1,
    numberOfSides: Number(numberOfSides),
    bonus: bonus ? Number(bonus) : 0,
  };
}

export { roll };
