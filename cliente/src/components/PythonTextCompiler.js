import { useRef, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import Hint from "./Hint";

export default function PythonTextCompiler({ onAfterRun = () => {} }) {
  const [code, setCode] = useState('print("Olá do Python!")');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  // Insere \t quando o utilizador pressiona Tab no textarea controlado
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? start;
      const insert = "\t";

      // Atualiza o estado com o texto + tab
      setCode((prev) => prev.slice(0, start) + insert + prev.slice(end));

      // Reposiciona o cursor após o update de estado
      // (espera um frame para o React re-renderizar)
      requestAnimationFrame(() => {
        try {
          const pos = start + insert.length;
          if (textareaRef.current) {
            textareaRef.current.selectionStart = pos;
            textareaRef.current.selectionEnd = pos;
          }
        } catch {}
      });
    }
  };

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3001/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResult(data);
      onAfterRun(code, data); // <--- NOVO
    } catch (e) {
      const err = { error: "Falha ao contactar servidor.", detail: String(e) };
      setResult(err);
      onAfterRun(code, err); // <--- NOVO
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row
        style={{ maxWidth: 1000, margin: "1rem auto", padding: 16, gap: 16 }}
      >
        <Col xs={12} md={6}>
          <h2>Executar Python</h2>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={14}
            style={{
              width: "100%",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              resize: "none",
              borderRadius: 8,
              padding: 12,
              border: "1px solid #e0e0e0",
            }}
            id="textbox"
          />
          <div style={{ marginTop: 8 }}>
            <Button onClick={run} disabled={loading} variant="secondary">
              {loading ? "A executar..." : "▶ Executar"}
            </Button>
          </div>
        </Col>

        <Col
          xs={12}
          md={5}
          style={{
            marginTop: 16,
            background: "black",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            minHeight: 200,
            whiteSpace: "pre-wrap",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Consola</h3>
          {result && (
            <div style={{ marginTop: 16, textAlign: "left" }}>
              {"error" in result ? (
                <>
                  <h4 style={{ color: "crimson" }}>Erro</h4>
                  <pre style={{ margin: 0 }}>
                    &gt;
                    {result.error}
                    {result.detail ? `\n${result.detail}` : ""}
                  </pre>
                </>
              ) : (
                <>
                  <pre style={{ margin: 0 }}>
                    &gt;
                    {result.stdout && result.stdout.length ? result.stdout : ""}
                    {result.stderr && result.stderr.length
                      ? `\n${result.stderr}`
                      : ""}
                  </pre>
                </>
              )}
            </div>
          )}
        </Col>
      </Row>

      <Row style={{ maxWidth: 1000, margin: "0 auto 1rem" }}>
        <Col>
          <Hint message="This is a hint message" />
        </Col>
      </Row>
    </>
  );
}
