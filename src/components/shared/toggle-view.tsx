import { LayoutGrid, Table } from "lucide-react";
import { Button } from "../ui/button";
type View  = "card" | "table"
export function ToggleView({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  return (
    <>
      <Button
        variant={view === "card" ? "default" : "outline"}
        onClick={() => onChange("card")}
      >
        <LayoutGrid className="w-5 h-5 mr-1" /> Card
      </Button>
      <Button
        variant={view === "table" ? "default" : "outline"}
        onClick={() => onChange("table")}
      >
        <Table className="w-5 h-5 mr-1" /> Table
      </Button>
    </>
  );
}