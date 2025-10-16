import Level from "./Level.tsx";

export default function Level2() {
  return (
    <Level
      id={2}
      level={2}
      expectedResult={"é par"}
      allowedVar={true}
      allowedCondition={true}
      allowedLoops={false}
      message={'Escreva um programa que verifique se um número é par ou ímpar. Use a variável \'num\' que já está definida no código.'}
    />
  );
}
