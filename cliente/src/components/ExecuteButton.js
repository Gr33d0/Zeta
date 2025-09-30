import Button from "react-bootstrap/Button";
export default function ExecuteButton({ onClick, loading }) {
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