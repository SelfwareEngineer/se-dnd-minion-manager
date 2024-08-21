"use strict";

function roll(expressionStr) {
  const expressionObj = parseExpressionStr(expressionStr);
  let rolls = [];
  const bonus = expressionObj.bonus;
  let total = 0;

  for (let i = 0; i <= expressionObj.numberOfDice; i++) {
    const result = Math.ceil(Math.random() * expressionObj.numberOfSides);
    rolls += result;
    total += result;
  }

  total += bonus;

  return {
    rolls,
    bonus,
    total,
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
