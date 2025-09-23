import { useId } from "react";
import Button from "react-bootstrap/Button";

export default function CommandBlock({ command }) {
  const btnId = useId();

  function onDragStart(e) {
    e.dataTransfer.setData("text/plain", btnId);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <Button
      id={btnId}
      draggable
      onDragStart={onDragStart}
      className="commandBlock"
      variant="secondary"
      data-code={command}
      style={{ cursor: "grab" }}
    >
      {command}
    </Button>
  );
}
