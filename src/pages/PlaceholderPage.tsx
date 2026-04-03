import { PageHeader } from "@diligentcorp/atlas-react-bundle";
import { Card, CardContent } from "@mui/material";

import PageLayout from "../components/PageLayout.js";
import EmptyState from "../components/common/EmptyState";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <PageLayout id={`page-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <PageHeader pageTitle={title} />
      <Card id={`${title.toLowerCase().replace(/\s+/g, "-")}-placeholder-card`}>
        <CardContent>
          <EmptyState
            id={`${title.toLowerCase().replace(/\s+/g, "-")}-empty-state`}
            title={`No ${title.toLowerCase()} yet`}
            description="This section is ready for content when you are."
            primaryActionLabel={`Add ${title.toLowerCase()}`}
            secondaryActionLabel="Learn more"
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
