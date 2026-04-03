import NoContentIcon from "@diligentcorp/atlas-react-bundle/icons/NoContent";
import { Button, Stack, Typography } from "@mui/material";

export default function EmptyState({
  title,
  description,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  id,
}: {
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  id?: string;
}) {
  return (
    <Stack
      id={id}
      alignItems="center"
      spacing={1.5}
      sx={{ py: 3, textAlign: "center" }}
    >
      <NoContentIcon />
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="textSm" color="text.secondary">
        {description}
      </Typography>
      <Stack direction="row" spacing={1.5}>
        <Button variant="contained" onClick={onPrimaryAction}>
          {primaryActionLabel}
        </Button>
        <Button variant="outlined" onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
