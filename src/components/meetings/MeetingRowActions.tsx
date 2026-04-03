import CopyIcon from "@diligentcorp/atlas-react-bundle/icons/Copy";
import EditIcon from "@diligentcorp/atlas-react-bundle/icons/Edit";
import SuccessIcon from "@diligentcorp/atlas-react-bundle/icons/Success";
import TrashIcon from "@diligentcorp/atlas-react-bundle/icons/Trash";
import UndoIcon from "@diligentcorp/atlas-react-bundle/icons/Undo";
import { IconButton, Stack, Tooltip } from "@mui/material";

import type { MeetingStatus } from "../../types/meetings";

export default function MeetingRowActions({
  onEdit,
  onPublish,
  onUnpublish,
  onDuplicate,
  onDelete,
  status,
}: {
  onEdit: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  status: MeetingStatus;
}) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Edit">
        <IconButton onClick={onEdit} aria-label="Edit">
          <EditIcon />
        </IconButton>
      </Tooltip>
      {status === "Draft" ? (
        <Tooltip title="Publish">
          <IconButton onClick={onPublish} aria-label="Publish">
            <SuccessIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Unpublish">
          <IconButton onClick={onUnpublish} aria-label="Unpublish">
            <UndoIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Duplicate">
        <IconButton onClick={onDuplicate} aria-label="Duplicate">
          <CopyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={onDelete} aria-label="Delete" sx={{ color: "error.main" }}>
          <TrashIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
