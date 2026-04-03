import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import AddIcon from "@diligentcorp/atlas-react-bundle/icons/Add";
import FilterIcon from "@diligentcorp/atlas-react-bundle/icons/Filter";
import SearchIcon from "@diligentcorp/atlas-react-bundle/icons/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Popover,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";

import PageLayout from "../components/PageLayout.js";
import MeetingFormPage from "../components/meetings/MeetingFormPage";
import MeetingDetailView from "../components/meetings/MeetingDetailView";
import MeetingRowActions from "../components/meetings/MeetingRowActions";
import TemplatePickerDialog from "../components/meetings/TemplatePickerDialog";
import DuplicateMeetingDialog from "../components/meetings/DuplicateMeetingDialog";
import ConfirmDialog from "../components/meetings/ConfirmDialog";
import type {
  Meeting,
  MeetingStatus,
  MeetingTab,
  MeetingTemplate,
  MeetingVisibility,
} from "../types/meetings";
import { formatDate, formatDateLong, getCountdown, getYear, isUpcoming } from "../utils/meetings";
import meetingsData from "../data/meetings.json";

function MeetingRow({
  meeting,
  onEdit,
  onPublish,
  onUnpublish,
  onDuplicate,
  onDelete,
  onClick,
}: {
  meeting: Meeting;
  onEdit: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <Box
      id={`meeting-row-${meeting.id}`}
      sx={{
        py: "12px",
        px: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
    >
      <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", lineHeight: 1, mb: "2px" }}>{meeting.name}</Typography>
      <Stack direction="row" alignItems="baseline">
        {/* Date + time + countdown */}
        <Box sx={{ width: "45%", flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {formatDateLong(meeting.date)}{meeting.time ? ` · ${meeting.time}` : ""}
            {getCountdown(meeting.date) ? ` · ${getCountdown(meeting.date)}` : ""}
          </Typography>
        </Box>
        {/* Status */}
        <Box sx={{ width: "15%", flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {meeting.status === "Published" ? "Published" : "Draft"}
          </Typography>
        </Box>
        {/* Visibility */}
        <Box sx={{ width: "15%", flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {meeting.visibility}
          </Typography>
        </Box>
        {/* Actions */}
        <Box sx={{ marginLeft: "auto", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <MeetingRowActions
            status={meeting.status}
            onEdit={onEdit}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default function MeetingsPage() {
  const { presets } = useTheme();
  const { meetings: seedMeetings, templates: seedTemplates, committees } = meetingsData as {
    meetings: Meeting[];
    templates: MeetingTemplate[];
    committees: string[];
  };
  const [meetings, setMeetings] = useState<Meeting[]>(seedMeetings);
  const [templates] = useState<MeetingTemplate[]>(seedTemplates);
  const [activeTab, setActiveTab] = useState<MeetingTab>("upcoming");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
  const [committeeFilter, setCommitteeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | "All">("All");
  const [visibilityFilter, setVisibilityFilter] = useState<MeetingVisibility | "All">("All");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateSource, setDuplicateSource] = useState<Meeting | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Meeting | null>(null);
  const [detailView, setDetailView] = useState<Meeting | null>(null);
  const [editView, setEditView] = useState<Meeting | null>(null);
  const [createTemplateId, setCreateTemplateId] = useState<string | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((meeting) =>
        !search ? true : meeting.name.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((meeting) => (statusFilter === "All" ? true : meeting.status === statusFilter))
      .filter((meeting) =>
        visibilityFilter === "All" ? true : meeting.visibility === visibilityFilter,
      )
      .filter((meeting) => (!committeeFilter ? true : meeting.committee === committeeFilter))
      .filter((meeting) => (!startDateFilter ? true : meeting.date >= startDateFilter))
      .filter((meeting) => (!endDateFilter ? true : meeting.date <= endDateFilter));
  }, [meetings, search, statusFilter, visibilityFilter, committeeFilter, startDateFilter, endDateFilter]);

  const sortedMeetings = useMemo(() => {
    const next = [...filteredMeetings];
    next.sort((a, b) =>
      sortBy === "date-desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );
    return next;
  }, [filteredMeetings, sortBy]);

  const upcomingMeetings = sortedMeetings.filter((meeting) => isUpcoming(meeting.date));
  const previousMeetings = sortedMeetings.filter((meeting) => !isUpcoming(meeting.date));
  const previousYears = Array.from(new Set(previousMeetings.map((meeting) => getYear(meeting.date)))).sort(
    (a, b) => b - a,
  );

  const visibleTemplates = showArchived ? templates : templates.filter((t) => t.status === "Active");

  const activeFilterCount = [
    committeeFilter,
    statusFilter !== "All" ? statusFilter : "",
    visibilityFilter !== "All" ? visibilityFilter : "",
    startDateFilter,
    endDateFilter,
  ].filter(Boolean).length;

  const meetingRowHandlers = (meeting: Meeting) => ({
    onEdit: () => setEditView(meeting),
    onPublish: () => setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? { ...m, status: "Published" as const } : m))),
    onUnpublish: () => setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? { ...m, status: "Draft" as const } : m))),
    onDuplicate: () => { setDuplicateSource(meeting); setDuplicateDialogOpen(true); },
    onDelete: () => setDeleteTarget(meeting),
    onClick: () => setDetailView(meeting),
  });

  if (detailView) {
    return (
      <MeetingDetailView
        meeting={detailView}
        onBack={() => setDetailView(null)}
        onEdit={() => { setEditView(detailView); setDetailView(null); }}
        onUpdate={(updated) => {
          setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          setDetailView(updated);
        }}
      />
    );
  }

  if (editView || createTemplateId !== null) {
    const template = createTemplateId
      ? templates.find((t) => t.id === createTemplateId) ?? null
      : null;
    return (
      <MeetingFormPage
        mode={editView ? "edit" : "create"}
        meeting={editView ?? undefined}
        template={template}
        committees={committees}
        onBack={() => { setEditView(null); setCreateTemplateId(null); }}
        onSubmit={(meeting) => {
          if (editView) {
            setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? meeting : m)));
          } else {
            setMeetings((prev) => [meeting, ...prev]);
          }
          setEditView(null);
          setCreateTemplateId(null);
          setDetailView(meeting);
        }}
      />
    );
  }

  return (
    <PageLayout id="page-meetings">
      <PageHeader
        pageTitle="Meetings"
        moreButton={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            {activeTab === "templates" ? "New template" : "New meeting"}
          </Button>
        }
      />

      <Stack gap={2} id="meetings-content">
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          {...presets?.TabsPresets?.Tabs?.alignToPageHeader}
        >
          <Tab label="Upcoming" value="upcoming" />
          <Tab label="Previous" value="previous" />
          <Tab label="Templates" value="templates" />
        </Tabs>

        {/* Toolbar — search, sort, filters in a recessed bar */}
        <Box
          sx={{
            bgcolor: "action.hover",
            borderRadius: 1,
            px: 2,
            py: 1.5,
          }}
          id="meetings-toolbar"
        >
        {activeTab !== "templates" ? (
          <>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-end"
          >
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Search</FormLabel>
              <TextField
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."

                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={(_, value) => { if (value) setSortBy(value); }}
              size="small"
              sx={{
                "& .MuiToggleButton-root": { fontSize: "0.8125rem", textTransform: "none" },
                "& .MuiToggleButton-root.Mui-selected": { color: "#fff", "&:hover": { color: "#fff" } },
              }}
            >
              <ToggleButton value="date-asc">Oldest first</ToggleButton>
              <ToggleButton value="date-desc">Newest first</ToggleButton>
            </ToggleButtonGroup>
            <Badge badgeContent={activeFilterCount} color="primary">
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterIcon />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ fontSize: "0.8125rem" }}
              >
                Filters
              </Button>
            </Badge>
            {activeFilterCount > 0 && (
              <Button
                variant="text"
                onClick={() => {
                  setCommitteeFilter("");
                  setStatusFilter("All");
                  setVisibilityFilter("All");
                  setStartDateFilter("");
                  setEndDateFilter("");
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
          <Popover
            open={Boolean(filterAnchor)}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{ paper: { sx: { p: 3, minWidth: 280 } } }}
          >
            <Stack spacing={2}>
              <FormControl fullWidth>
                <FormLabel>Committee</FormLabel>
                <Select
                  value={committeeFilter}
                  onChange={(event) => setCommitteeFilter(event.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">All</MenuItem>
                  {committees.map((value) => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Status</FormLabel>
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as MeetingStatus | "All")}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel>Visibility</FormLabel>
                <Select
                  value={visibilityFilter}
                  onChange={(event) => setVisibilityFilter(event.target.value as MeetingVisibility | "All")}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1.5}>
                <FormControl fullWidth>
                  <FormLabel>From</FormLabel>
                  <TextField type="date" size="small" value={startDateFilter} onChange={(event) => setStartDateFilter(event.target.value)} />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel>To</FormLabel>
                  <TextField type="date" size="small" value={endDateFilter} onChange={(event) => setEndDateFilter(event.target.value)} />
                </FormControl>
              </Stack>
            </Stack>
          </Popover>
          </>
        ) : (
          <Stack direction="row" spacing={1.5} alignItems="flex-end">
            <FormControl sx={{ minWidth: 180 }}>
              <FormLabel>Search</FormLabel>
              <TextField
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 180 }}>
              <FormLabel>Show archived</FormLabel>
              <Select
                value={showArchived ? "yes" : "no"}
                onChange={(event) => setShowArchived(event.target.value === "yes")}
              >
                <MenuItem value="no">Active only</MenuItem>
                <MenuItem value="yes">Active + archived</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
        </Box>

        {/* Upcoming tab */}
        {activeTab === "upcoming" && (
          <Box id="meetings-upcoming-list">
            {upcomingMeetings.length === 0 ? (
              <Alert severity="info">No upcoming meetings</Alert>
            ) : (
              upcomingMeetings.map((meeting) => (
                <MeetingRow
                  key={meeting.id}
                  meeting={meeting}
                  {...meetingRowHandlers(meeting)}
                />
              ))
            )}
          </Box>
        )}

        {/* Previous tab */}
        {activeTab === "previous" && (
          <Stack gap={2} id="meetings-previous-accordion">
            {previousYears.map((year) => (
              <Accordion key={year} defaultExpanded id={`meetings-year-${year}`}>
                <AccordionSummary>
                  <Typography variant="subtitle2">{year}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box id={`meetings-year-${year}-list`}>
                    {previousMeetings
                      .filter((meeting) => getYear(meeting.date) === year)
                      .map((meeting) => (
                        <MeetingRow
                          key={meeting.id}
                          meeting={meeting}
                          {...meetingRowHandlers(meeting)}
                        />
                      ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}

        {/* Templates tab */}
        {activeTab === "templates" && (
          <Box id="meetings-templates-list">
            {visibleTemplates.map((template) => (
              <Box
                key={template.id}
                id={`template-row-${template.id}`}
                sx={{
                  py: 2,
                  px: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack flex={1} spacing={0.25}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{template.name}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                      >
                        Used {template.meetingsCreated} time{template.meetingsCreated !== 1 ? "s" : ""}
                      </Typography>
                      {template.lastUsed && (
                        <>
                          <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>|</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last used: {formatDate(template.lastUsed)}
                            {template.lastMeetingName && (
                              <>
                                {" — "}
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{ color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                >
                                  {template.lastMeetingName}
                                </Typography>
                              </>
                            )}
                          </Typography>
                        </>
                      )}
                      <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>|</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                      >
                        Preview template
                      </Typography>
                    </Stack>
                  </Stack>
                  <MeetingRowActions
                    status="Draft"
                    onEdit={() => {}}
                    onPublish={() => {}}
                    onUnpublish={() => {}}
                    onDuplicate={() => {}}
                    onDelete={() => {}}
                  />
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Stack>


      <TemplatePickerDialog
        open={createDialogOpen}
        templates={templates}
        onClose={() => setCreateDialogOpen(false)}
        onSelect={(templateId) => {
          setCreateDialogOpen(false);
          setCreateTemplateId(templateId);
        }}
      />
      <DuplicateMeetingDialog
        open={duplicateDialogOpen}
        meeting={duplicateSource}
        committees={committees}
        onClose={() => { setDuplicateDialogOpen(false); setDuplicateSource(null); }}
        onDuplicate={(meeting) => setMeetings((prev) => [meeting, ...prev])}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete meeting?"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            setMeetings((prev) => prev.filter((meeting) => meeting.id !== deleteTarget.id));
          }
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </PageLayout>
  );
}
