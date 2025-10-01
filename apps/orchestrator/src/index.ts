export function runWorkflow(name: string, input: any) {
  console.log(JSON.stringify({ invoked: name, input }));
}

export { scheduleWorkflows } from './scheduler.js';
