import { useId } from "react";
import Button from "react-bootstrap/Button";

/**
 * Bloco da palete (fonte). Sem \t.
 * Se abrir escopo (if/for/while...), usa prop `tab` -> data-tab="1".
 * Templates suportados via prop `template`: "assign" | "if" | "print".
 */
export default function CommandBlock({ id, command, tab, template }) {
  const autoId = useId();
  const btnId = id || `cb-${autoId}`;

  function onDragStart(e) {
    e.dataTransfer.setData("text/plain", btnId);
    e.dataTransfer.effectAllowed = "copyMove";
  }

  return (
    <Button
      id={btnId}
      draggable
      onDragStart={onDragStart}
      className="commandBlock paletteBlock"
      variant="secondary"
      data-code={command}
      {...(tab ? { "data-tab": "1" } : {})}
      {...(template ? { "data-template": template } : {})}
      style={{ cursor: "grab", fontFamily: "monospace", width: "100%", textAlign: "left" }}
      title={template ? `template: ${template}` : undefined}
    >
      {command}
    </Button>
  );
}
