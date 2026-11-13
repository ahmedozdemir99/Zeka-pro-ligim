import { createWorker } from './sites.mjs';

// The Access application verifies the visitor before Workers exposes this context.
export default createWorker(async (_request, context) => {
  const identity = await context?.access?.getIdentity().catch(() => undefined);
  if (typeof identity?.email !== 'string' || !identity.email.trim()) return undefined;
  return 'cf-access:' + identity.email.trim().toLowerCase();
}, true);
