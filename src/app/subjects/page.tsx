export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { PageSection } from "@/components/page-section";
import { CreateSubjectDialog } from "@/components/subject-forms";
import { SubjectsTable } from "@/components/subjects-table";
import { listSubjects } from "@/lib/subjects";

export default async function SubjectsPage() {
  const subjects = await listSubjects();

  return (
    <AppShell currentPath="/subjects" title="Subjects" description="Manage the queue that feeds daily article generation.">
      <PageSection
        title="Queue management"
        description="Keep manual ideas and AI suggestions ordered without losing sight of the pipeline."
        action={<CreateSubjectDialog />}
      >
        <SubjectsTable subjects={subjects} />
      </PageSection>
    </AppShell>
  );
}
