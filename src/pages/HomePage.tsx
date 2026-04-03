import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import ArrowRightIcon from "@diligentcorp/atlas-react-bundle/icons/ArrowRight";
import SuccessIcon from "@diligentcorp/atlas-react-bundle/icons/Success";
import DocumentIcon from "@diligentcorp/atlas-react-bundle/icons/Document";
import FlagIcon from "@diligentcorp/atlas-react-bundle/icons/Flag";
import PolicyIcon from "@diligentcorp/atlas-react-bundle/icons/Policy";
import TimeAndDateIcon from "@diligentcorp/atlas-react-bundle/icons/TimeAndDate";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

import PageLayout from "../components/PageLayout.js";
import StatusPill from "../components/common/StatusPill";
import DateBadge from "../components/home/DateBadge";
import type { Meeting } from "../types/meetings";
import meetingsData from "../data/meetings.json";
import homeData from "../data/home.json";
import {
  formatDate,
  formatDateLong,
  getDayOfMonth,
  getMonthAbbrev,
  isUpcoming,
} from "../utils/meetings";

export default function HomePage() {
  const navigate = useNavigate();
  const [welcomeExpanded, setWelcomeExpanded] = useState(false);
  const {
    agendaItems,
    featuredPolicies,
    featuredDocuments,
    featuredGoals,
    boardMembers,
    welcomeParagraphs,
  } = homeData;
  const meetings = meetingsData.meetings as Meeting[];

  const upcomingMeetings = meetings
    .filter((meeting) => isUpcoming(meeting.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
    .map((meeting) => ({
      id: meeting.id,
      month: getMonthAbbrev(meeting.date),
      day: getDayOfMonth(meeting.date),
      name: meeting.name,
      fullDate: formatDateLong(meeting.date),
      time: meeting.time,
      location: meeting.location,
      status: meeting.status,
      visibility: meeting.visibility,
    }));

  const recentMeetings = meetings
    .filter((meeting) => !isUpcoming(meeting.date))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((meeting) => ({
      id: meeting.id,
      name: meeting.name,
      date: formatDate(meeting.date),
      status: meeting.status,
    }));

  const statusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "subtle";
      case "Published":
        return "success";
      case "Public":
        return "information";
      case "Internal":
        return "generic";
      case "Action needed":
        return "warning";
      case "Submitted":
        return "information";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Draft agenda":
        return "subtle";
      default:
        return "generic";
    }
  };

  return (
    <PageLayout id="page-home">
      <PageHeader pageTitle="Home" />
      <Box
        id="home-grid"
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        }}
      >
        <Box>
          <Stack gap={3} id="home-primary-column">
            <Card id="home-meetings-card">
              <Stack direction="row" alignItems="center">
                <Typography variant="h2">Meetings</Typography>
                <Button
                  variant="text"
                  size="small"
                  endIcon={<ArrowRightIcon />}
                  onClick={() => navigate("/meetings")}
                  sx={{ textTransform: "none", fontSize: "0.75rem", ml: "auto" }}
                >
                  View all meetings
                </Button>
              </Stack>
              <CardContent>
                <Stack gap={2} id="home-meetings-content">
                  <Typography variant="overline" color="text.secondary">
                    Upcoming
                  </Typography>
                  <Box
                    id="home-upcoming-grid"
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                    }}
                  >
                    {upcomingMeetings.map((meeting) => (
                      <Box key={meeting.id}>
                        <Card
                          variant="outlined"
                          id={`home-upcoming-${meeting.id}`}
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate("/meetings")}
                        >
                          <CardContent>
                            <Stack direction="row" spacing={2}>
                                <DateBadge month={meeting.month} day={meeting.day} />
                              <Stack spacing={0.5} flex={1} minWidth={0}>
                                <Typography variant="subtitle2" noWrap>
                                  {meeting.name}
                                </Typography>
                                <Typography variant="textSm" color="text.secondary" noWrap>
                                  {meeting.fullDate} · {meeting.time}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <StatusPill
                                    label={meeting.status}
                                    color={statusColor(meeting.status) as "success" | "subtle"}
                                  />
                                  {meeting.status === "Published" && (
                                    <StatusPill
                                      label={meeting.visibility}
                                      color={statusColor(meeting.visibility) as "information" | "generic"}
                                    />
                                  )}
                                </Stack>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>

                  <Stack spacing={1} pt={1}>
                    <Typography variant="overline" color="text.secondary">
                      Recent
                    </Typography>
                    <List disablePadding id="home-recent-list">
                      {recentMeetings.map((meeting) => (
                        <ListItem
                          key={meeting.id}
                          sx={{ px: 0, cursor: "pointer" }}
                          id={`home-recent-${meeting.id}`}
                          onClick={() => navigate("/meetings")}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                            <TimeAndDateIcon />
                            <Typography variant="textSm" noWrap>
                              {meeting.name}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="textSm" color="text.secondary">
                              {meeting.date}
                            </Typography>
                            <StatusPill
                              label={meeting.status}
                              color={statusColor(meeting.status) as "success" | "subtle"}
                            />
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card id="home-agenda-card">
              <CardHeader title="My agenda items" />
              <CardContent>
                <List disablePadding id="home-agenda-list">
                  {agendaItems.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{ px: 0, cursor: "pointer" }}
                      id={`home-agenda-${item.id}`}
                      onClick={() => navigate("/agenda")}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                        <SuccessIcon />
                        <Typography variant="textSm" noWrap>
                          {item.title}
                        </Typography>
                      </Stack>
                      <StatusPill
                        label={item.status}
                        color={
                          statusColor(
                            item.status === "Draft" ? "Draft agenda" : item.status,
                          ) as "warning" | "information" | "success" | "error" | "subtle"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Stack gap={2} id="home-featured-section">
              <Stack id="home-featured-header">
                <Typography variant="subtitle1">Featured</Typography>
                <Typography variant="textSm" color="text.secondary">
                  Selected by your administrator
                </Typography>
              </Stack>

              <Box
                id="home-featured-grid"
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                }}
              >
                <Box>
                  <Card id="home-featured-policies-card">
                    <CardHeader
                      title="Policies"
                      action={
                        <Button variant="text" onClick={() => navigate("/policies")}>
                          View all
                        </Button>
                      }
                    />
                    <CardContent>
                      <List disablePadding id="home-featured-policies-list">
                        {featuredPolicies.map((policy) => (
                          <ListItem
                            key={policy.id}
                            sx={{ px: 0, cursor: "pointer" }}
                            id={`home-featured-policy-${policy.id}`}
                            onClick={() => navigate("/policies")}
                          >
                            <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                              <PolicyIcon />
                              <Typography variant="textSm" noWrap>
                                {policy.title}
                              </Typography>
                            </Stack>
                            <Typography variant="textSm" color="text.secondary">
                              {policy.subtitle}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Box>
                <Box>
                  <Card id="home-featured-files-card">
                    <CardHeader
                      title="Files"
                      action={
                        <Button variant="text" onClick={() => navigate("/library/files")}>
                          View all
                        </Button>
                      }
                    />
                    <CardContent>
                      <List disablePadding id="home-featured-files-list">
                        {featuredDocuments.map((doc) => (
                          <ListItem
                            key={doc.id}
                            sx={{ px: 0, cursor: "pointer" }}
                            id={`home-featured-file-${doc.id}`}
                            onClick={() => navigate("/library/files")}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              <DocumentIcon />
                              <Typography variant="textSm">{doc.title}</Typography>
                            </Stack>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              <Card id="home-featured-goals-card">
                <CardHeader
                  title="Goals"
                  action={
                    <Button variant="text" onClick={() => navigate("/library/goals")}>
                      View all
                    </Button>
                  }
                />
                <CardContent>
                  <Stack spacing={2} id="home-featured-goals-list">
                    {featuredGoals.map((goal) => (
                      <Stack key={goal.id} spacing={1} id={`home-featured-goal-${goal.id}`}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FlagIcon />
                            <Typography variant="textSm">{goal.title}</Typography>
                          </Stack>
                          <Typography variant="textSm" color="text.secondary">
                            {goal.progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={goal.progress} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Box>

        <Box>
          <Stack gap={3} id="home-secondary-column">
            <Card id="home-welcome-card">
              <CardHeader
                title="Emerald City School District"
                action={
                  <Box
                    component="img"
                    src="/org-logo.png"
                    alt="Organization logo"
                    sx={{ width: 48, height: 48 }}
                  />
                }
              />
              <CardContent>
                <Typography variant="textSm" color="text.secondary" sx={{ mb: 2 }}>
                  {welcomeExpanded ? welcomeParagraphs.join(" ") : welcomeParagraphs[0]}
                </Typography>
                <Button
                  variant="text"
                  id="home-welcome-toggle"
                  onClick={() => setWelcomeExpanded((prev) => !prev)}
                >
                  {welcomeExpanded ? "Show less" : "Show more"}
                </Button>
              </CardContent>
            </Card>

            <Card id="home-board-members-card">
              <CardHeader title="Board members" />
              <CardContent>
                <List disablePadding id="home-board-members-list">
                  {boardMembers.map((member) => (
                    <ListItem
                      key={member.name}
                      sx={{ px: 0 }}
                      id={`home-board-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Stack direction="row" spacing={1}>
                        <Typography variant="textSm">{member.name}</Typography>
                        <Typography variant="textSm" color="text.secondary">
                          · {member.role}
                        </Typography>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </PageLayout>
  );
}
