import StatusPill from "../common/StatusPill";

export default function StatusChip({ label }: { label: string }) {
  const color = (() => {
    switch (label) {
      case "Draft":
      case "Archived":
      case "Not published":
        return "subtle";
      case "Published":
      case "Active":
        return "success";
      case "Public":
        return "information";
      case "Internal":
        return "generic";
      case "Out of sync":
        return "warning";
      default:
        return "generic";
    }
  })();

  return <StatusPill label={label} color={color} />;
}
