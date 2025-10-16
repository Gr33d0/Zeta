import Button from "react-bootstrap/Button";
interface ExecuteButtonProps {
  onClick: () => void;
  loading: boolean;
}
export default function ExecuteButton({ onClick, loading }: ExecuteButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      style={{ marginTop: 12 }}
    >
      {loading ? "A executar..." : "▶ Executar"}
    </Button>
  );
}