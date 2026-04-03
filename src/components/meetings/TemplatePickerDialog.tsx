import AddIcon from "@diligentcorp/atlas-react-bundle/icons/Add";
import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import TemplateIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import type { MeetingTemplate } from "../../types/meetings";

export default function TemplatePickerDialog({
  open,
  templates,
  onClose,
  onSelect,
}: {
  open: boolean;
  templates: MeetingTemplate[];
  onClose: () => void;
  onSelect: (templateId: string | null) => void;
}) {
  const activeTemplates = templates.filter((t) => t.status === "Active");
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">New meeting</Typography>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="textSm" color="text.secondary" sx={{ mb: 2 }}>
          Start with a template or create a blank meeting.
        </Typography>
        <Stack gap={1.5}>
          {activeTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outlined"
              onClick={() => onSelect(template.id)}
              sx={{ justifyContent: "flex-start", textAlign: "left" }}
              startIcon={<TemplateIcon />}
            >
              <Stack alignItems="flex-start">
                <Typography variant="textSm">{template.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {template.committee}
                </Typography>
              </Stack>
            </Button>
          ))}
          <Button
            variant="outlined"
            onClick={() => onSelect(null)}
            sx={{ justifyContent: "flex-start" }}
            startIcon={<AddIcon />}
          >
            Start from scratch
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
