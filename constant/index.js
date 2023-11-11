export const difficultyOptions = [
  {
    value: "easy",
    option: "Easy",
  },
  {
    value: "medium",
    option: "Medium",
  },
  {
    value: "hard",
    option: "Hard",
  },
];

export const modeOptions = [
  {
    option: "Normal",
    value:
      "The questions should be related to the top 5 European football leagues, FIFA World Cup, UEFA Euro Cup, and UEFA Champions League. Include topics on players, records, football rules, and general trivia.",
  },
  {
    option: "Guess the Player",
    value:
      "The questions should be based on the players from the top 5 European football leagues, and should be worded in the following manner: French centreback that Plays for FC barcelona, or portugese left winger that plays for Juventus. The answer should be the name of the player",
  },
];

export const alphabeticNumeral = (index) => {
  const asciiCode = index + 65;
  const letter = String.fromCharCode(asciiCode);
  return letter + ". ";
};
