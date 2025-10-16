import Level from "./Level.tsx";

export default function Level1() {
  return (
    <Level
      id={1}
      level={1}
      expectedResult={"Ola mundo"}

      message={'Usa o comando print para escrever \'Ola mundo\' na consola '}
    />
  );
}
