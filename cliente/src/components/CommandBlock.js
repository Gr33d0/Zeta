import { useId } from "react";
import Button from "react-bootstrap/Button";

/**
 * Bloco da palete. Se receber `template`, marcamos em data-template.
 * Exemplos:
 *  - template="assign"  command=" = "
 *  - template="if"      command="if :"
 *  - template="print"   command="print()"
 */
export default function CommandBlock({ id, command, tab, template }) {
  const autoId = useId();
  const btnId = id || `cb-${autoId}`;

  function onDragStart(e) {
    e.dataTransfer.setData("text/plain", btnId);
    e.dataTransfer.effectAllowed = "move";
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
      style={{ cursor: "grab", fontFamily: "monospace" }}
      title={template ? `template: ${template}` : undefined}
    >
      {command}
    </Button>
  );
}
