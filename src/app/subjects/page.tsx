export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { CreateSubjectForm } from "@/components/subject-forms";
import { SubjectsTable } from "@/components/subjects-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSubjects } from "@/lib/subjects";

export default async function SubjectsPage() {
  const subjects = await listSubjects();

  return (
    <AppShell currentPath="/subjects" title="Subjects" description="Manage the queue that feeds daily article generation.">
      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add subject</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateSubjectForm />
          </CardContent>
        </Card>
        <SubjectsTable subjects={subjects} />
      </section>
    </AppShell>
  );
}
