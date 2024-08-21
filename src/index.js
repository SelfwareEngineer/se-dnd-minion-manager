"use strict";
import "./style.css";
import * as minions from "./modules/minions.js";

console.log("test");

const bob = minions.zombie("Bob");

console.log(bob);

const testDamage = {
  poison: { rolls: [0], bonus: 99, total: 99 },
  bludgeoning: { rolls: [0], bonus: 99, total: 99 },
};

bob.takeDamage(testDamage);
