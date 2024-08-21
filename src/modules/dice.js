"use strict";

function roll(expressionStr, isCrit = false) {
  const expressionObj = parseExpressionStr(expressionStr);

  if (expressionObj.numberOfSides === 20 && expressionObj.numberOfDice > 1) {
    throw new Error(
      "Error: dice.roll() only accepts 1 d20 at a time. For advantage and disadvantage, use rollAdvantage() and rollDisadvantage().",
    );
  }

  if (isCrit) {
    expressionObj.numberOfDice *= 2;
  }

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
