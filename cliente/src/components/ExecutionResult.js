import "../css/ExecutionResult.css";


async function validateOutput(result, data, id) {
    if(result=== data){
    try {
      
      await fetch(`http://localhost:3001/api/updateDataUser/${id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },

      });
      return console.log("Nível completado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao atualizar o progresso do usuário:", error);
      
    }
  }
}

export default function ExecutionResult({ result, data,id }) {


  const errText =
    result &&
    ((typeof result.error === "string" && result.error.trim()) ||
      (typeof result.stderr === "string" && result.stderr.trim()));
  const outText =
    result &&
    ((typeof result.stdout === "string" && result.stdout.trim()) || "");
    console.log(outText);
    validateOutput(outText, data, id);

  return (
    <div className="main-div">
      {errText ? (
        <>
          <h5 className="error-title">Erro</h5>
          <pre className="output-text">
            {(result.error && String(result.error)) || String(result.stderr)}
          </pre>
        </>
      ) : (
        <>
          <h5 className="output-title">Saída</h5>
          <pre className="output-text">{outText || ""}</pre>
        </>
      )}
    </div>
  );
}
