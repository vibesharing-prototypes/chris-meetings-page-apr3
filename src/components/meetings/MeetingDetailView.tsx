import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";
import MoreIcon from "@diligentcorp/atlas-react-bundle/icons/More";
import TemplateIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";

import PageLayout from "../PageLayout";
import type { Meeting } from "../../types/meetings";
import { formatDateLong } from "../../utils/meetings";
import ConfirmDialog from "./ConfirmDialog";
import StatusChip from "./StatusChip";

export default function MeetingDetailView({
  meeting,
  onBack,
  onUpdate,
  onEdit,
}: {
  meeting: Meeting;
  onBack: () => void;
  onUpdate: (meeting: Meeting) => void;
  onEdit: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <PageLayout id="page-meeting-detail">
      <PageHeader
        pageTitle={meeting.name}
        pageSubtitle={`${formatDateLong(meeting.date)} · ${meeting.time ?? "Time TBD"}`}
        slotProps={{ backButton: { onClick: onBack, "aria-label": "Back to meetings" } }}
        moreButton={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onEdit}>
              Edit
            </Button>
            {meeting.status === "Draft" ? (
              <Button
                variant="contained"
                onClick={() => onUpdate({ ...meeting, status: "Published" })}
              >
                Publish
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setConfirmOpen(true)}>
                Unpublish
              </Button>
            )}
            <IconButton aria-label="More actions">
              <MoreIcon />
            </IconButton>
          </Stack>
        }
      />
      <Stack gap={2}>
        <Stack direction="row" spacing={1}>
          <StatusChip label={meeting.status} />
          <StatusChip label={meeting.visibility} />
          <StatusChip label={meeting.agendaStatus} />
        </Stack>
        {meeting.description && (
          <Typography variant="textSm" color="text.secondary">
            {meeting.description}
          </Typography>
        )}
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<TemplateIcon />}>
            View agenda
          </Button>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Add minutes
          </Button>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        title="Unpublish meeting?"
        message="Unpublishing will hide the meeting from public view."
        confirmLabel="Unpublish"
        onConfirm={() => { onUpdate({ ...meeting, status: "Draft" }); setConfirmOpen(false); }}
        onClose={() => setConfirmOpen(false)}
      />
    </PageLayout>
  );
}
