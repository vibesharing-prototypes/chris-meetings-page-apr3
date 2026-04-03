export type MeetingStatus = "Draft" | "Published";
export type MeetingVisibility = "Public" | "Internal";
export type AgendaStatus = "Not published" | "Published" | "Out of sync";
export type TemplateStatus = "Active" | "Archived";

export type Meeting = {
  id: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  committee: string;
  status: MeetingStatus;
  visibility: MeetingVisibility;
  agendaStatus: AgendaStatus;
  agendaCategories: number;
  agendaItems: number;
  membersOnly: boolean;
  publicRTS: boolean;
  description?: string;
  videoUrl?: string;
};

export type MeetingTemplate = {
  id: string;
  name: string;
  committee: string;
  time?: string;
  location?: string;
  status: TemplateStatus;
  meetingsCreated: number;
  lastUsed?: string;
  lastMeetingName?: string;
  agendaCategories?: number;
  agendaItems?: number;
};

export type MeetingTab = "upcoming" | "previous" | "templates";
