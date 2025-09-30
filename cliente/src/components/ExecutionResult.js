export default function ExecutionResult({ result }) {
  const errText =
    result &&
    ((typeof result.error === "string" && result.error.trim()) ||
      (typeof result.stderr === "string" && result.stderr.trim()));
  const outText =
    result &&
    ((typeof result.stdout === "string" && result.stdout.trim()) || "");

  return (
    <div
      style={{
        marginTop: 16,
        background: "#111",
        color: "#fff",
        borderRadius: 8,
        padding: 16,
        fontFamily: "monospace",
        fontSize: 16,
        minHeight: 80,
        whiteSpace: "pre-wrap",
      }}
    >
      {errText ? (
        <>
          <h5 style={{ color: "#ff5555" }}>Erro</h5>
          <pre style={{ background: "none", color: "#fff", margin: 0 }}>
            {(result.error && String(result.error)) || String(result.stderr)}
          </pre>
        </>
      ) : (
        <>
          <h5 style={{ color: "#fff" }}>Saída</h5>
          <pre style={{ background: "none", color: "#fff", margin: 0 }}>
            {outText || ""}
          </pre>
        </>
      )}
    </div>
  );
}