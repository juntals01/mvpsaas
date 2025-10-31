// apps/api/src/polyfills/crypto.ts
// Works in CJS or ESM builds
import * as nodeCrypto from 'node:crypto';

if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = nodeCrypto as unknown;
}
