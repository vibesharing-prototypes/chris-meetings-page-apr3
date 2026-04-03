import CloseIcon from "@diligentcorp/atlas-react-bundle/icons/Close";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { Meeting } from "../../types/meetings";
import { formatDate } from "../../utils/meetings";

export default function DuplicateMeetingDialog({
  open,
  meeting,
  committees,
  onClose,
  onDuplicate,
}: {
  open: boolean;
  meeting: Meeting | null;
  committees: string[];
  onClose: () => void;
  onDuplicate: (meeting: Meeting) => void;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [committee, setCommittee] = useState("");

  useEffect(() => {
    if (open && meeting) {
      setName(meeting.name);
      setDate("");
      setCommittee(meeting.committee);
    }
  }, [open, meeting]);

  if (!meeting) return null;

  const handleDuplicate = () => {
    if (!date) return;
    onDuplicate({
      ...meeting,
      id: `m-dup-${Date.now()}`,
      name: name || meeting.name,
      date,
      committee,
      status: "Draft",
      visibility: "Internal",
      agendaStatus: "Not published",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Duplicate meeting</Typography>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Source: {formatDate(meeting.date)} — {meeting.name}
        </Alert>
        <Stack gap={2}>
          <FormControl>
            <FormLabel>New name</FormLabel>
            <TextField value={name} onChange={(event) => setName(event.target.value)} />
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>New date</FormLabel>
              <TextField type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Target committee</FormLabel>
              <Select value={committee} onChange={(event) => setCommittee(event.target.value)}>
                {committees.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDuplicate} disabled={!date}>
          Duplicate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
