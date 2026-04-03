import { useTheme } from "@mui/material";

type StatusColor =
  | "warning"
  | "success"
  | "error"
  | "information"
  | "generic"
  | "subtle";

export default function StatusPill({
  label,
  color,
}: {
  label: string;
  color: StatusColor;
}) {
  const { presets } = useTheme();
  const StatusIndicator = presets.StatusIndicatorPresets?.components.StatusIndicator;

  if (!StatusIndicator) return null;
  return <StatusIndicator color={color} label={label} />;
}
