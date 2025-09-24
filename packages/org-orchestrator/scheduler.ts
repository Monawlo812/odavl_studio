// Org-wide workflow scheduler for ODAVL
export interface RepoConfig {
  name: string;
  prPerDay: number;
  ciMinutesPerHour: number;
}

export async function scheduleWorkflows(repos: RepoConfig[], maxConcurrency = 2) {
  let running = 0;
  for (const _ of repos) {
    if (running >= maxConcurrency) break;
    // Simulate scheduling scanHealPrWorkflow
    running++;
    setTimeout(() => {
      running--;
      // In real use, would trigger Temporal workflow here
    }, 100);
  }
  return running;
}
