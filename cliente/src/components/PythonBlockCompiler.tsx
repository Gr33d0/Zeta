import CommandBlock from "./CommandBlock.tsx";
import { useRef, useState, useEffect } from "react";
import {  Row, Col } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import ExecuteButton from "./ExecuteButton.tsx";
import ExecutionResult from "./ExecutionResult.tsx";

interface PythonBlockCompilerProps {
  allowedVar?: boolean;
  allowedCondition?: boolean;
  allowedLoops?: boolean;
  level?: number;
  expectedResult?: string;
  id?: number;
}

interface DragState {
  draggingEl: HTMLElement | null;
}

interface ExecutionResultState {
  stdout?: string;
  stderr?: string;
  error?: string;
  detail?: string;
}

export default function PythonBlockCompiler({
  allowedVar = false,
  allowedCondition = false,
  allowedLoops = false,
  level,
  expectedResult,
  id,
}: PythonBlockCompilerProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState>({ draggingEl: null });

  const [dropH, setDropH] = useState<number>(240);
  const [result, setResult] = useState<ExecutionResultState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // === Altura do drop sincronizada com a palete ===
  useEffect(() => {
    const el = paletteRef.current;
    if (!el) return;

    const sync = (): void => {
      setDropH(Math.ceil(el.getBoundingClientRect().height));
    };

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
  function onZoneDragOver(
    e: React.DragEvent<HTMLElement>,
    zoneEl: HTMLElement
  ): void {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    zoneEl.classList.add("dragover");

    const { draggingEl } = dragState.current;

    if (draggingEl && draggingEl.classList?.contains("programBlock")) {
      const after = getDragAfterElement(zoneEl, e.clientY);

      if (!after) {
        if (draggingEl.parentElement !== zoneEl) {
          zoneEl.appendChild(draggingEl);
        } else if (zoneEl.lastElementChild !== draggingEl) {
          zoneEl.appendChild(draggingEl);
        }
      } else if (after !== draggingEl) {
        zoneEl.insertBefore(draggingEl, after);
      }
    }
  }

  function onZoneDragLeave(
    e: React.DragEvent<HTMLElement>,
    zoneEl: HTMLElement
  ): void {
    e.preventDefault();
    e.stopPropagation();
    zoneEl.classList.remove("dragover");
  }

  function onZoneDrop(
    e: React.DragEvent<HTMLElement>,
    zoneEl: HTMLElement
  ): void {
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

  function getDragAfterElement(
    container: HTMLElement,
    y: number
  ): HTMLElement | null {
    const els = [...container.children].filter((el) =>
      el.classList?.contains("programBlock")
    ) as HTMLElement[];

    let closest: { offset: number; element: HTMLElement | null } = {
      offset: Number.NEGATIVE_INFINITY,
      element: null,
    };

    for (const child of els) {
      const rect = child.getBoundingClientRect();
      const offset = y - (rect.top + rect.height / 2);
      if (offset < 0 && offset > closest.offset)
        closest = { offset, element: child };
    }

    return closest.element;
  }

  // === Criar bloco do programa (DOM) ===
  function createProgramBlockFromPalette(paletteEl: Element): HTMLDivElement {
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
    wrap.addEventListener("dragstart", (e: DragEvent) => {
      const dragEvent = e as DragEvent;
      dragEvent.stopPropagation();
      dragState.current.draggingEl = wrap;
      wrap.classList.add("dragging");
      dragEvent.dataTransfer!.effectAllowed = "move";
      dragEvent.dataTransfer!.setData("text/plain", "program-block");
    });

    wrap.addEventListener("dragend", (e: DragEvent) => {
      const dragEvent = e as DragEvent;
      dragEvent.stopPropagation();
      wrap.classList.remove("dragging");
      const el = document.elementFromPoint(dragEvent.clientX, dragEvent.clientY);
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
      const varInp = createInput("var", "a", updatePreview);
      const eq = createTextNode("=");
      const exprInp = createInput("expr", "2", updatePreview);
      header.append(varInp, eq, exprInp);
      const preview = createTextNode("   → a=2");
      stylePreview(preview);
      header.appendChild(preview);

      function updatePreview(): void {
        preview.textContent = `   → ${varInp.value || "a"}=${
          exprInp.value || "2"
        }`;
      }

      updatePreview();
    } else if (tpl === "if") {
      const ifTxt = createTextNode("if ");
      const condInp = createInput("cond", "a<2", updatePreview);
      const colon = createTextNode(":");
      header.append(ifTxt, condInp, colon);
      const preview = createTextNode("   → if a<2:");
      stylePreview(preview);
      header.appendChild(preview);

      function updatePreview(): void {
        preview.textContent = `   → if ${condInp.value || "a<2"}:`;
      }

      updatePreview();
    } else if (tpl === "print") {
      const p1 = createTextNode("print(");
      const exprInp = createInput("expr", "a+b", updatePreview);
      const p2 = createTextNode(")");
      header.append(p1, exprInp, p2);
      const preview = createTextNode("   → print(a+b)");
      stylePreview(preview);
      header.appendChild(preview);

      function updatePreview(): void {
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

      childZone.addEventListener("dragover", (e: DragEvent) =>
        onZoneDragOver(e as any, childZone)
      );
      childZone.addEventListener("dragleave", (e: DragEvent) =>
        onZoneDragLeave(e as any, childZone)
      );
      childZone.addEventListener("drop", (e: DragEvent) =>
        onZoneDrop(e as any, childZone)
      );

      wrap.appendChild(childZone);
    }

    return wrap;

    // helpers
    function createInput(
      role: string,
      placeholder: string,
      onChange: () => void
    ): HTMLInputElement {
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

    function createTextNode(txt: string): HTMLSpanElement {
      const span = document.createElement("span");
      span.textContent = txt;
      return span;
    }

    function stylePreview(node: HTMLSpanElement): void {
      node.style.opacity = "0.6";
      node.style.marginLeft = "8px";
    }
  }

  // === Execução ===
  async function run(codeStr: string): Promise<void> {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3001/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeStr }),
      });

      let data: any;
      const ct = res.headers.get("content-type") || "";

      if (ct.includes("application/json")) data = await res.json();
      else data = { stdout: await res.text() };

      setResult(normalizeBackendResponse(data, res.ok));
    } catch (e) {
      setResult({
        error: "Falha ao contactar servidor.",
        detail: String(e),
      });
    } finally {
      setLoading(false);
    }
  }

  function normalizeBackendResponse(
    data: any,
    okFlag: boolean
  ): ExecutionResultState {
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

    if (!stdout && !stderr) {
      return {
        stdout: "",
        stderr: "",
      };
    }

    return {
      stdout: String(stdout || ""),
      stderr: String(stderr || ""),
    };
  }

  // === Geração de código ===
  function codeFromHeader(headerEl: HTMLElement | null): string {
    if (!headerEl) return "";

    const tpl = headerEl.getAttribute("data-template") || "";

    if (tpl === "assign") {
      const varInp = headerEl.querySelector(
        'input[data-role="var"]'
      ) as HTMLInputElement | null;
      const exprInp = headerEl.querySelector(
        'input[data-role="expr"]'
      ) as HTMLInputElement | null;
      const v = (varInp?.value || "a").trim();
      const x = (exprInp?.value || "2").trim();
      return `${v}=${x}`;
    }

    if (tpl === "if") {
      const condInp = headerEl.querySelector(
        'input[data-role="cond"]'
      ) as HTMLInputElement | null;
      const c = (condInp?.value || "a<2").trim();
      return `if ${c}:`;
    }

    if (tpl === "print") {
      const exprInp = headerEl.querySelector(
        'input[data-role="expr"]'
      ) as HTMLInputElement | null;
      const x = (exprInp?.value || "a+b").trim();
      return `print(${x})`;
    }

    return (
      headerEl.getAttribute("data-code") ?? headerEl.textContent?.trim() ?? ""
    );
  }

  function generateFromZone(
    zoneEl: HTMLElement,
    indent: number = 0,
    acc: string[] = []
  ): string[] {
    const blocks = [...zoneEl.children].filter((n) =>
      n.classList?.contains("programBlock")
    ) as HTMLElement[];

    for (const block of blocks) {
      const header = block.querySelector(".programHeader") as HTMLElement | null;
      const line = codeFromHeader(header);
      acc.push(`${"  ".repeat(indent)}${line}`);

      const opens = header?.getAttribute("data-tab") === "1";
      if (opens) {
        const childZone = block.querySelector(".childZone") as HTMLElement | null;
        if (childZone) generateFromZone(childZone, indent + 1, acc);
      }
    }

    return acc;
  }

  function gerarCodigo(): void {
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
              {allowedVar && (
                <ListGroup.Item>
                  <CommandBlock
                    id={1}
                    command=" = "
                    template="assign"
                  />
                </ListGroup.Item>
              )}

              {allowedCondition && (
                <ListGroup.Item>
                  <CommandBlock
                    id={2}
                    command="if :"
                    template="if"
                    tab
                  />
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <CommandBlock
                  id={3}
                  command="print()"
                  template="print"
                />
              </ListGroup.Item>

              {allowedLoops && (
                <ListGroup.Item>
                  <CommandBlock
                    id={4}
                    command="for  in :"
                    template="for"
                    tab
                  />
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </Col>

        {/* Zona de drop (direita) */}
        <Col md={8}>
          <h5 style={{ marginBottom: 8 }}>Constrói o programa</h5>
          <div
            id="main-drop"
            ref={mainRef}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
              mainRef.current && onZoneDragOver(e, mainRef.current)
            }
            onDragLeave={(e: React.DragEvent<HTMLDivElement>) =>
              mainRef.current && onZoneDragLeave(e, mainRef.current)
            }
            onDrop={(e: React.DragEvent<HTMLDivElement>) =>
              mainRef.current && onZoneDrop(e, mainRef.current)
            }
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

          <ExecutionResult
            level={level || 0}
            result={result || undefined}
            id={id || 1}
            data={expectedResult || ""}
          />
        </Col>
      </Row>
    </div>
  );
}