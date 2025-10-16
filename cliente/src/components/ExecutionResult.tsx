import { useEffect } from "react";
import "../css/ExecutionResult.css";

async function validateOutput(
  result: string,
  data: string,
  id: number,
  level: number
): Promise<void> {
  const userStars = parseInt(localStorage.getItem("userStars") || "0");

  if (result === data && userStars === level) {
    try {
      await fetch(`http://localhost:3001/api/updateDataUser/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      return console.log("Nível completado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o progresso do usuário:", error);
    }
  } else {
    console.log(
      "Nivel já completado ou resposta incorreta" + userStars + "Level:" + level
    );
  }
}

interface ExecutionResultProps {
  result?: Result;
  data: string;
  id: number;
  level: number;
}
interface Result {
  stdout?: string;
  stderr?: string;
  error?: string;
}

export default function ExecutionResult({ result, data, id, level }: ExecutionResultProps) {
  const errText: string | false =
    (result &&
      ((typeof result.error === "string" && result.error.trim()) ||
        (typeof result.stderr === "string" && result.stderr.trim()))) ||
    false;

  const outText: string =
    (result &&
      (typeof result.stdout === "string" ? result.stdout.trim() : "")) ||
    "";

  useEffect(() => {
    if (outText) {
      validateOutput(outText, data, id, level);
    }
  }, [outText, data, id, level]);

  if (!result) {
    return <div className="main-div">Aguardando resultado...</div>;
  }

  return (
    <div className="main-div">
      {errText ? (
        <>
          <h5 className="error-title">Erro</h5>
          <pre className="output-text">
            {result?.error || result?.stderr || ""}
          </pre>
        </>
      ) : (
        <>
          <h5 className="output-title">Saída</h5>
          <pre className="output-text">{outText}</pre>
        </>
      )}
    </div>
  );
};
