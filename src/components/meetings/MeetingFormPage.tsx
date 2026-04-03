import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import PageLayout from "../PageLayout";
import type {
  Meeting,
  MeetingTemplate,
  MeetingVisibility,
} from "../../types/meetings";

export default function MeetingFormPage({
  mode,
  meeting,
  template,
  committees,
  onBack,
  onSubmit,
}: {
  mode: "create" | "edit";
  meeting?: Meeting;
  template?: MeetingTemplate | null;
  committees: string[];
  onBack: () => void;
  onSubmit: (meeting: Meeting) => void;
}) {
  const [name, setName] = useState(meeting?.name ?? template?.name ?? "");
  const [date, setDate] = useState(meeting?.date ?? "");
  const [time, setTime] = useState(meeting?.time ?? template?.time ?? "");
  const [location, setLocation] = useState(meeting?.location ?? template?.location ?? "");
  const [committee, setCommittee] = useState(meeting?.committee ?? template?.committee ?? "");
  const [description, setDescription] = useState(meeting?.description ?? "");
  const [visibility, setVisibility] = useState<MeetingVisibility>(
    meeting?.visibility ?? "Public",
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const nextErrors = [];
    if (!name.trim()) nextErrors.push("Name is required.");
    if (!date) nextErrors.push("Date is required.");
    if (!committee) nextErrors.push("Committee is required.");
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    const base: Meeting = meeting ?? {
      id: `m-new-${Date.now()}`,
      status: "Draft",
      agendaStatus: "Not published",
      agendaCategories: 0,
      agendaItems: 0,
      membersOnly: false,
      publicRTS: false,
    } as Meeting;

    onSubmit({
      ...base,
      name: name.trim(),
      date,
      time: time || undefined,
      location: location || undefined,
      committee,
      description: description || undefined,
      visibility,
    });
  };

  return (
    <PageLayout id="page-meeting-form">
      <PageHeader
        pageTitle={mode === "edit" ? "Edit meeting" : "Draft meeting"}
        pageSubtitle={template ? `Template: ${template.name} · ${template.committee}` : undefined}
        slotProps={{ backButton: { onClick: onBack, "aria-label": "Back to meetings" } }}
      />
      <Stack gap={2} sx={{ maxWidth: 720 }}>
        {errors.length > 0 && (
          <Alert severity="error">
            {errors.map((error) => (
              <Typography key={error} variant="textSm">
                {error}
              </Typography>
            ))}
          </Alert>
        )}
        <FormControl>
          <FormLabel required>Name</FormLabel>
          <TextField value={name} onChange={(event) => setName(event.target.value)} />
        </FormControl>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <FormLabel required>Date</FormLabel>
            <TextField type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>Time</FormLabel>
            <TextField value={time} onChange={(event) => setTime(event.target.value)} />
          </FormControl>
        </Stack>
        <FormControl>
          <FormLabel required>Committee</FormLabel>
          <Select value={committee} onChange={(event) => setCommittee(event.target.value)}>
            {committees.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <TextField value={location} onChange={(event) => setLocation(event.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Meeting visibility</FormLabel>
          <Select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as MeetingVisibility)}
          >
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Internal">Internal</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <TextField
            multiline
            minRows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormControl>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {mode === "edit" ? "Save changes" : "Create draft"}
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
