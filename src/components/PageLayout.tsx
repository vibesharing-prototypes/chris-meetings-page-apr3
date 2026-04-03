import { Container, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren<{ id?: string }>;

export default function PageLayout({ children, id }: PageLayoutProps) {
  return (
    <Container id={id} sx={{ py: 2 }}>
      <Stack gap={3}>{children}</Stack>
    </Container>
  );
}
