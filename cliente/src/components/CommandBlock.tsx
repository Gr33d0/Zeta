import { useId } from "react";
import Button from "react-bootstrap/Button";
import React from "react";

interface CommandBlockProps {
  id?: number;
  command: string;
  tab?: boolean;
  template?: string;
}

export default function CommandBlock({ id, command, tab, template }: CommandBlockProps) {
  const autoId = useId();
  const btnId = id ? `cb-${id}` : `cb-${autoId}`;

  function onDragStart(e: React.DragEvent<HTMLButtonElement>): void {
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
      style={{
        cursor: "grab",
        fontFamily: "monospace",
        width: "100%",
        textAlign: "left",
      }}
      title={template ? `template: ${template}` : undefined}
    >
      {command}
    </Button>
  );
}
