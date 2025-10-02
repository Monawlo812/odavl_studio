export type RepoConfig = {
  name: string;
  prPerDay: number;
  ciMinutesPerHour: number;
};

export async function scheduleWorkflows(repos: RepoConfig[], maxConcurrency: number): Promise<number> {
  // Simulate scheduling logic
  return Math.min(repos.length, maxConcurrency);
}
