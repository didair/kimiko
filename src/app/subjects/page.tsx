export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { CreateSubjectForm } from "@/components/subject-forms";
import { SubjectsTable } from "@/components/subjects-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listSubjects } from "@/lib/subjects";

export default async function SubjectsPage() {
  const subjects = await listSubjects();

  return (
    <AppShell currentPath="/subjects" title="Subjects" description="Manage the queue that feeds daily article generation.">
      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Add subject</CardTitle>
            <CardDescription>Create a manual article idea and place it at the end of the queue.</CardDescription>
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
