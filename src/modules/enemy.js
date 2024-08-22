const enemy = (name, maxArmorClass = 99, minArmorClass = 0) => ({
  id: "e-" + Date.now() + (Math.random() * 2000 - 1000),
  name,
  maxArmorClass,
  minArmorClass,
});

export { enemy };
