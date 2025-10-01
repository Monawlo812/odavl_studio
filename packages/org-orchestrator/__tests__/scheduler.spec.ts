<<<<<<< HEAD
<<<<<<< HEAD
import { describe, it, expect } from 'vitest';
import { scheduleWorkflows, RepoConfig } from '../scheduler.js';

describe('scheduler', () => {
  it('schedules up to maxConcurrency', async () => {
    const repos: RepoConfig[] = [
      { name: 'repo1', prPerDay: 2, ciMinutesPerHour: 10 },
      { name: 'repo2', prPerDay: 1, ciMinutesPerHour: 5 }
    ];
    const running = await scheduleWorkflows(repos, 1);
    expect(running).toBeLessThanOrEqual(1);
  });
=======
import { scheduleWorkflows, RepoConfig } from '../scheduler.js';
test('schedules up to maxConcurrency', async () => {
  const repos: RepoConfig[] = [
    { name: 'repo1', prPerDay: 2, ciMinutesPerHour: 10 },
    { name: 'repo2', prPerDay: 1, ciMinutesPerHour: 5 }
  ];
  const running = await scheduleWorkflows(repos, 1);
  expect(running).toBeLessThanOrEqual(1);
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
import { describe, it, expect } from 'vitest';
import { scheduleWorkflows, RepoConfig } from '../scheduler.js';

describe('scheduler', () => {
  it('schedules up to maxConcurrency', async () => {
    const repos: RepoConfig[] = [
      { name: 'repo1', prPerDay: 2, ciMinutesPerHour: 10 },
      { name: 'repo2', prPerDay: 1, ciMinutesPerHour: 5 }
    ];
    const running = await scheduleWorkflows(repos, 1);
    expect(running).toBeLessThanOrEqual(1);
  });
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
});
