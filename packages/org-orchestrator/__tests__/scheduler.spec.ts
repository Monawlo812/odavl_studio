import { scheduleWorkflows, RepoConfig } from '../scheduler.js';
test('schedules up to maxConcurrency', async () => {
  const repos: RepoConfig[] = [
    { name: 'repo1', prPerDay: 2, ciMinutesPerHour: 10 },
    { name: 'repo2', prPerDay: 1, ciMinutesPerHour: 5 }
  ];
  const running = await scheduleWorkflows(repos, 1);
  expect(running).toBeLessThanOrEqual(1);
});
