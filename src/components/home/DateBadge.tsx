import { Box, Typography, useTheme } from "@mui/material";

export default function DateBadge({ month, day }: { month: string; day: string }) {
  const { tokens } = useTheme();
  const indigo = tokens.core.color.indigo;
  const background = indigo["95"]?.value ?? indigo["90"]?.value;
  const foreground = indigo["40"]?.value ?? indigo["35"]?.value;

  return (
    <Box
      sx={{
        width: 56,
        textAlign: "center",
        borderRadius: tokens.semantic.radius.md.value,
        backgroundColor: background,
        color: foreground,
        py: 1,
      }}
    >
      <Typography variant="labelSm" sx={{ fontWeight: tokens.core.fontWeight.semiBold.value }}>
        {month}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: tokens.core.fontWeight.semiBold.value, lineHeight: 1.05 }}
      >
        {day}
      </Typography>
    </Box>
  );
}
