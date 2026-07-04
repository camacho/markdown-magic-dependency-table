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

  it('renders a dependency whose package restricts its exports map (e.g. find-up) without throwing', () => {
    const result = format({
      content: 'foo',
      options: {
        pkg: './__fixtures__/with-deps/package.json',
        production: 'true',
      },
      srcPath,
    });

    expect(result).toMatch(/find-up/);
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

  it('renders a dashed placeholder row for a dependency that cannot be resolved on disk, without throwing', () => {
    const call = () =>
      format({
        content: 'foo',
        options: {
          pkg: './__fixtures__/unresolvable-dep/package.json',
          production: 'true',
        },
        srcPath,
      });

    expect(call).not.toThrow();

    const result = call();

    expect(result).toMatch(/totally-nonexistent-package-xyz-12345/);
    // version, description, and license all fall back to '-' when the
    // package can't be found under node_modules.
    expect(result).toMatch(
      /totally-nonexistent-package-xyz-12345@\^1\.0\.0\]\([^)]+\) \| - \| - \| - \| production/,
    );
  });

  it('truncates a declared semver range longer than the threshold to 7 chars + "..."', () => {
    const result = format({
      content: 'foo',
      options: {
        pkg: './__fixtures__/long-semver-range/package.json',
        production: 'true',
      },
      srcPath,
    });

    // sanitizeSemver: maxLength defaults to 10, truncateStr defaults to '...' (3
    // chars), so anything over 7 chars gets cut to 7 chars + '...'.
    expect(result).toMatch(/semver@>=1\.2\.3\.\.\./);
  });

  it('passes a declared semver range through untouched when at/below the truncation threshold', () => {
    const result = format({
      content: 'foo',
      options: {
        pkg: './__fixtures__/long-semver-range/package.json',
        production: 'true',
      },
      srcPath,
    });

    // find-up's declared range in this fixture ("^8.0.0") is 6 chars, at
    // the 7-char threshold, so it passes through untouched.
    expect(result).toMatch(/find-up@\^8\.0\.0\]/);
    expect(result).not.toMatch(/find-up@\^8\.0\.0\.\.\./);
  });

  it('falls back to UNLICENSED when a resolved dependency has no license field', () => {
    const result = format({
      content: 'foo',
      options: {
        pkg: './__fixtures__/license-fallback/package.json',
        production: 'true',
      },
      srcPath,
    });

    expect(result).toMatch(/no-license-pkg/);
    expect(result).toMatch(/UNLICENSED/);
  });

  it('resolves a scoped package (@scope/pkg) via the node_modules walk', () => {
    const result = format({
      content: 'foo',
      options: {
        pkg: './__fixtures__/scoped-dep/package.json',
        production: 'true',
      },
      srcPath,
    });

    expect(result).toMatch(/@scope\/pkg/);
    // Resolved via the fixture's own node_modules, so version/license come
    // from that local package.json rather than the '-' placeholder.
    expect(result).toMatch(/2\.0\.0/);
    expect(result).toMatch(/MIT/);
  });

  describe('dependency type selection', () => {
    it('filters to only devDependencies when dev option is set', () => {
      const result = format({
        content: 'foo',
        options: {
          pkg: './__fixtures__/all-dep-types/package.json',
          dev: 'true',
        },
        srcPath,
      });

      expect(result).toMatch(/find-up/);
      expect(result).toMatch(/\| dev \|/);
      expect(result).not.toMatch(/\| production \|/);
      expect(result).not.toMatch(/\| optional \|/);
      expect(result).not.toMatch(/\| peer \|/);
    });

    it('filters to only optionalDependencies when optional option is set', () => {
      const result = format({
        content: 'foo',
        options: {
          pkg: './__fixtures__/all-dep-types/package.json',
          optional: 'true',
        },
        srcPath,
      });

      expect(result).toMatch(/find-up/);
      expect(result).toMatch(/\| optional \|/);
      expect(result).not.toMatch(/\| production \|/);
      expect(result).not.toMatch(/\| dev \|/);
      expect(result).not.toMatch(/\| peer \|/);
    });

    it('filters to only production dependencies when production option is set', () => {
      const result = format({
        content: 'foo',
        options: {
          pkg: './__fixtures__/all-dep-types/package.json',
          production: 'true',
        },
        srcPath,
      });

      expect(result).toMatch(/\| production \|/);
      expect(result).not.toMatch(/\| dev \|/);
      expect(result).not.toMatch(/\| optional \|/);
      expect(result).not.toMatch(/\| peer \|/);
    });

    it('filters to only peerDependencies via the "peers" option', () => {
      const result = format({
        content: 'foo',
        options: {
          pkg: './__fixtures__/all-dep-types/package.json',
          peers: 'true',
        },
        srcPath,
      });

      expect(result).toMatch(/\| peer \|/);
      expect(result).not.toMatch(/\| production \|/);
      expect(result).not.toMatch(/\| dev \|/);
      expect(result).not.toMatch(/\| optional \|/);
    });

    it('renders all four dependency types when no type option is set', () => {
      const result = format({
        content: 'foo',
        options: {
          pkg: './__fixtures__/all-dep-types/package.json',
        },
        srcPath,
      });

      expect(result).toMatch(/\| production \|/);
      expect(result).toMatch(/\| dev \|/);
      expect(result).toMatch(/\| optional \|/);
      expect(result).toMatch(/\| peer \|/);
    });
  });
});
