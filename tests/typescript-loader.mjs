import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Resolve the app's TS path aliases in Node's standalone integration checks.
registerHooks({
  resolve(specifier, context, next) {
    let url;
    if (specifier.startsWith('@/')) url = new URL(`../src/${specifier.slice(2)}`, import.meta.url);
    else if (specifier.startsWith('.') && context.parentURL?.includes('/src/')) url = new URL(specifier, context.parentURL);
    if (url && !url.pathname.endsWith('.ts')) {
      const file = new URL(`${url.href}.ts`);
      const index = new URL(`${url.href}/index.ts`);
      if (existsSync(file)) return { url: file.href, shortCircuit: true };
      if (existsSync(index)) return { url: index.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith('.ts') && url.includes('/src/')) return {
      format: 'module', shortCircuit: true,
      source: ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
    };
    return next(url, context);
  },
});
