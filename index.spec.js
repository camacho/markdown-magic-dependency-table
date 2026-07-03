import path from 'path';
import { describe, expect, it } from 'vitest';
import format from './index.js';

const srcPath = path.join(import.meta.dirname, 'README.md');

describe('markdown-magic-dependency-table', () => {
  it('renders a dependency table for the nearest package.json', () => {
    const result = format({
      content: 'foo',
      options: {
        pkg: './__fixtures__/with-deps/package.json',
        production: 'true',
      },
      srcPath,
    });

    expect(result).toMatch(/\*\*Dependency\*\*/);
    expect(result).toMatch(/semver/);
    expect(result).toMatch(/production/);
  });

  it('never returns an empty string when no dependencies match the requested type', () => {
    const result = format({
      content: 'untouched',
      options: {
        pkg: './__fixtures__/no-deps/package.json',
        production: 'true',
      },
      srcPath,
    });

    expect(result).not.toBe('');
    expect(result).not.toBe('untouched');
    expect(result).toMatch(/\*\*Dependency\*\*/);
  });
});
