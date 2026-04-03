import { AppLayout } from "@diligentcorp/atlas-react-bundle";
import { Outlet, Route, Routes } from "react-router";
import "./styles.css";

import Navigation from "./Navigation.js";
import HomePage from "./pages/HomePage.js";
import MeetingsPage from "./pages/MeetingsPage.js";
import PlaceholderPage from "./pages/PlaceholderPage.js";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout navigation={<Navigation />}>
            <Outlet />
          </AppLayout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="agenda" element={<PlaceholderPage title="Agenda items" />} />
        <Route path="policies" element={<PlaceholderPage title="Policies" />} />
        <Route path="library/files" element={<PlaceholderPage title="Files" />} />
        <Route path="library/goals" element={<PlaceholderPage title="Goals" />} />
        <Route path="library/events" element={<PlaceholderPage title="Events" />} />
        <Route path="library/members" element={<PlaceholderPage title="Board members" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>
    </Routes>
  );
}
