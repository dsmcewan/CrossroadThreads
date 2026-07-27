import { StatusChip } from "crossroad-collection";

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", padding: 24 }}>
      {children}
    </div>
  );
}

export function Statuses() {
  return (
    <Row>
      <StatusChip status="ON DISPLAY" />
      <StatusChip status="IN CONSERVATION" />
      <StatusChip status="UNDER STUDY" />
    </Row>
  );
}

export function Small() {
  return (
    <Row>
      <StatusChip status="ON DISPLAY" small />
      <StatusChip status="IN CONSERVATION" small />
      <StatusChip status="UNDER STUDY" small />
    </Row>
  );
}
