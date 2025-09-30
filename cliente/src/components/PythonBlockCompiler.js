import CommandBlock from "./CommandBlock";
import { useRef, useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import ExecuteButton from "./ExecuteButton";
import ExecutionResult from "./ExecutionResult";
/**
 * PythonBlockCompiler
 * - Palete (esquerda) com blocos e templates editáveis: assign (" = "), if ("if :"), print ("print()")
 * - Zona de drop (direita) com reordenação por drag interno e aninhamento (childZone para if)
 * - Clona quando vem da palete; move quando é programBlock
 * - Remove bloco ao largar fora de qualquer zona (dragend + elementFromPoint)
 * - Geração de código recursiva (indent por profundidade)
 * - Altura do drop = altura da palete (ResizeObserver)
 * - Render exclusivo: Erro OU Saída OU (sem saída)
 */
export default function PythonBlockCompiler({
   allowedVar = false,
  allowedCondition = false,
  allowedLoops = false
}

 
) {
  const mainRef = useRef(null); // zona raiz (drop)
  const paletteRef = useRef(null); // coluna da palete (para medir altura)
  const dragState = useRef({ draggingEl: null });

  const [dropH, setDropH] = useState(240);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Altura do drop sincronizada com a palete ===
  useEffect(() => {
    const el = paletteRef.current;
    if (!el) return;
    const sync = () => setDropH(Math.ceil(el.getBoundingClientRect().height));
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    sync();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  // === DnD helpers (com reordenação) ===
  function onZoneDragOver(e, zoneEl) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    zoneEl.classList.add("dragover");

    const { draggingEl } = dragState.current || {};
    if (draggingEl && draggingEl.classList?.contains("programBlock")) {
      const after = getDragAfterElement(zoneEl, e.clientY);
      if (!after) {
        if (draggingEl.parentElement !== zoneEl) zoneEl.appendChild(draggingEl);
        else if (zoneEl.lastElementChild !== draggingEl)
          zoneEl.appendChild(draggingEl);
      } else if (after !== draggingEl) {
        zoneEl.insertBefore(draggingEl, after);
      }
    }
  }

  function onZoneDragLeave(e, zoneEl) {
    e.preventDefault();
    e.stopPropagation();
    zoneEl.classList.remove("dragover");
  }

  function onZoneDrop(e, zoneEl) {
    e.preventDefault();
    e.stopPropagation();
    zoneEl.classList.remove("dragover");

    const id = e.dataTransfer.getData("text/plain");
    const srcEl = document.getElementById(id);

    // 1) Se veio da palete → clona e insere no ponto certo
    if (srcEl?.classList?.contains("paletteBlock")) {
      const programBlock = createProgramBlockFromPalette(srcEl);
      const after = getDragAfterElement(zoneEl, e.clientY);
      if (!after) zoneEl.appendChild(programBlock);
      else zoneEl.insertBefore(programBlock, after);
      return;
    }
    // 2) Se é drag interno, já reordenámos em dragover; nada a fazer aqui.
  }

  function getDragAfterElement(container, y) {
    const els = [...container.children].filter((el) =>
      el.classList?.contains("programBlock")
    );
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    for (const child of els) {
      const rect = child.getBoundingClientRect();
      const offset = y - (rect.top + rect.height / 2);
      if (offset < 0 && offset > closest.offset)
        closest = { offset, element: child };
    }
    return closest.element;
  }

  // === Criar bloco do programa (DOM) ===
  function createProgramBlockFromPalette(paletteEl) {
    const wrap = document.createElement("div");
    wrap.className = "programBlock";
    wrap.setAttribute("draggable", "true");
    Object.assign(wrap.style, {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "8px",
      background: "#fff",
      width: "100%",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    });

    // Drag interno (move) + remover se soltar fora
    wrap.addEventListener("dragstart", (e) => {
      e.stopPropagation();
      dragState.current.draggingEl = wrap;
      wrap.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "program-block"); // placeholder
    });
    wrap.addEventListener("dragend", (e) => {
      e.stopPropagation();
      wrap.classList.remove("dragging");
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const inZone = !!(el && el.closest("#main-drop, .childZone"));
      if (!inZone) wrap.remove();
      dragState.current.draggingEl = null;
    });

    // Cabeçalho (conteúdo)
    const header = document.createElement("div");
    header.className = "programHeader";
    Object.assign(header.style, {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "6px",
      fontFamily: "monospace",
    });

    const codeText = paletteEl.getAttribute("data-code") ?? "";
    const tpl = paletteEl.getAttribute("data-template") || "";
    const opensScope = paletteEl.getAttribute("data-tab") === "1";
    if (opensScope) header.setAttribute("data-tab", "1");
    if (tpl) header.setAttribute("data-template", tpl);

    if (tpl === "assign") {
      const varInp = input("var", "a", updatePreview);
      const eq = textNode("=");
      const exprInp = input("expr", "2", updatePreview);
      header.append(varInp, eq, exprInp);
      const preview = textNode("   → a=2");
      stylePreview(preview);
      header.appendChild(preview);
      function updatePreview() {
        preview.textContent = `   → ${varInp.value || "a"}=${
          exprInp.value || "2"
        }`;
      }
      updatePreview();
    } else if (tpl === "if") {
      const ifTxt = textNode("if ");
      const condInp = input("cond", "a<2", updatePreview);
      const colon = textNode(":");
      header.append(ifTxt, condInp, colon);
      const preview = textNode("   → if a<2:");
      stylePreview(preview);
      header.appendChild(preview);
      function updatePreview() {
        preview.textContent = `   → if ${condInp.value || "a<2"}:`;
      }
      updatePreview();
    } else if (tpl === "print") {
      const p1 = textNode("print(");
      const exprInp = input("expr", "a+b", updatePreview);
      const p2 = textNode(")");
      header.append(p1, exprInp, p2);
      const preview = textNode("   → print(a+b)");
      stylePreview(preview);
      header.appendChild(preview);
      function updatePreview() {
        preview.textContent = `   → print(${exprInp.value || "a+b"})`;
      }
      updatePreview();
    } else {
      header.setAttribute("data-code", codeText);
      header.textContent = codeText;
    }

    wrap.appendChild(header);

    // Se abre escopo, cria childZone com DnD completo
    if (opensScope) {
      const label = document.createElement("div");
      label.textContent = "blocos dentro deste if:";
      Object.assign(label.style, { fontSize: "12px", opacity: "0.8" });
      wrap.appendChild(label);

      const childZone = document.createElement("div");
      childZone.className = "childZone";
      Object.assign(childZone.style, {
        minHeight: "60px",
        border: "1px dashed #aaa",
        borderRadius: "8px",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      });
      childZone.addEventListener("dragover", (e) =>
        onZoneDragOver(e, childZone)
      );
      childZone.addEventListener("dragleave", (e) =>
        onZoneDragLeave(e, childZone)
      );
      childZone.addEventListener("drop", (e) => onZoneDrop(e, childZone));

      wrap.appendChild(childZone);
    }

    return wrap;

    // helpers
    function input(role, placeholder, onChange) {
      const el = document.createElement("input");
      el.type = "text";
      el.placeholder = placeholder;
      el.setAttribute("data-role", role);
      Object.assign(el.style, {
        fontFamily: "monospace",
        padding: "2px 6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
      });
      el.addEventListener("input", onChange);
      return el;
    }
    function textNode(txt) {
      const span = document.createElement("span");
      span.textContent = txt;
      return span;
    }
    function stylePreview(node) {
      node.style.opacity = "0.6";
      node.style.marginLeft = "8px";
    }
  }

  // === Execução ===
  async function run(codeStr) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3001/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeStr }),
      });
      let data;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) data = await res.json();
      else data = { stdout: await res.text() };
      setResult(normalizeBackendResponse(data, res.ok));
    } catch (e) {
      setResult({ error: "Falha ao contactar servidor.", detail: String(e) });
    } finally {
      setLoading(false);
    }
  }

  function normalizeBackendResponse(data, okFlag) {
    if (typeof data === "string") return { stdout: data };
    if (data.error) {
      return {
        error: data.error,
        detail: data.detail || data.stack || data.message || "",
        stdout: data.stdout || "",
        stderr: data.stderr || "",
      };
    }
    const stdout =
      data.stdout ??
      data.output ??
      data.result ??
      (okFlag ? data.message : "") ??
      "";
    const stderr = data.stderr ?? (!okFlag ? data.message || "Erro" : "");
    if (!stdout && !stderr)
      return { stdout: "", stderr: "", info: "Sem saída do programa." };
    return { stdout: String(stdout || ""), stderr: String(stderr || "") };
  }

  // === Geração de código ===
  function codeFromHeader(headerEl) {
    const tpl = headerEl.getAttribute("data-template") || "";
    if (tpl === "assign") {
      const varInp = headerEl.querySelector('input[data-role="var"]');
      const exprInp = headerEl.querySelector('input[data-role="expr"]');
      const v = (varInp?.value || "a").trim();
      const x = (exprInp?.value || "2").trim();
      return `${v}=${x}`;
    }
    if (tpl === "if") {
      const condInp = headerEl.querySelector('input[data-role="cond"]');
      const c = (condInp?.value || "a<2").trim();
      return `if ${c}:`;
    }
    if (tpl === "print") {
      const exprInp = headerEl.querySelector('input[data-role="expr"]');
      const x = (exprInp?.value || "a+b").trim();
      return `print(${x})`;
    }
    return (
      headerEl.getAttribute("data-code") ?? headerEl.textContent?.trim() ?? ""
    );
  }

  function generateFromZone(zoneEl, indent = 0, acc = []) {
    const blocks = [...zoneEl.children].filter((n) =>
      n.classList?.contains("programBlock")
    );
    for (const block of blocks) {
      const header = block.querySelector(".programHeader");
      const line = codeFromHeader(header);
      acc.push(`${"  ".repeat(indent)}${line}`);

      const opens = header?.getAttribute("data-tab") === "1";
      if (opens) {
        const childZone = block.querySelector(".childZone");
        if (childZone) generateFromZone(childZone, indent + 1, acc);
      }
    }
    return acc;
  }

  function gerarCodigo() {
    const zone = mainRef.current;
    if (!zone) return;
    const linhas = generateFromZone(zone, 0, []);
    const codeStr = linhas.join("\n");

    run(codeStr);
  }

  // === Render ===
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Row>
        {/* Palete (esquerda) */}
        <Col md={4}>
          <h5 style={{ marginBottom: 8 }}>Palete</h5>
          <div ref={paletteRef}>
            <ListGroup>
              {/* Editáveis */}
              {allowedVar && (
                <ListGroup.Item>
                  <CommandBlock
                    id="tpl-assign"
                    command=" = "
                    template="assign"
                  />
                </ListGroup.Item>
              )}

              {allowedCondition && (
                <ListGroup.Item>
                  <CommandBlock
                    id="tpl-if"
                    command="if :"
                    template="if"
                    tab={1}
                  />
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <CommandBlock
                  id="tpl-print"
                  command="print()"
                  template="print"
                />
              </ListGroup.Item>

              {allowedLoops && (
                <ListGroup.Item>
                  <CommandBlock
                    id="tpl-for"
                    command="for  in :"
                    template="for"
                    tab={1}
                  />
                </ListGroup.Item>
              )}
              {/* Exemplos fixos */}
            </ListGroup>
          </div>
        </Col>

        {/* Zona de drop (direita) */}
        <Col md={8}>
          <h5 style={{ marginBottom: 8 }}>Constrói o programa</h5>
          <div
            id="main-drop"
            ref={mainRef}
            onDragOver={(e) => onZoneDragOver(e, mainRef.current)}
            onDragLeave={(e) => onZoneDragLeave(e, mainRef.current)}
            onDrop={(e) => onZoneDrop(e, mainRef.current)}
            style={{
              height: dropH,
              overflowY: "auto",
              border: "1px dashed #aaa",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 8,
              background: "#fcfcfc",
            }}
          />
          <ExecuteButton onClick={gerarCodigo} loading={loading} />

          <ExecutionResult result={result} />
        </Col>
      </Row>
    </div>
  );
}
