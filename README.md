# Dependency table

Add a table of dependencies to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
npm i markdown-magic markdown-magic-dependency-table --save-dev
```

## Adding the plugin

See `example.js` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->

```js
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import DEPENDENCYTABLE from './index.js';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    DEPENDENCYTABLE,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (DEPENDENCYTABLE) -->

| **Dependency**                                                               | **Description**                                                        | **Version** | **License** | **Type**   |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- | ----------- | ---------- |
| [find-up@^8.0.0](https://github.com/sindresorhus/find-up)                    | Find a file or directory by walking up parent directories              | 8.0.0       | MIT         | production |
| [semver@^7.0.0](https://github.com/git+https://github.com/npm/node-semver)   | The semantic version parser used by npm.                               | 7.8.5       | ISC         | production |
| [markdown-magic@^4](https://github.com/DavidWells/markdown-magic#readme)     | Automatically update markdown files with content from external sources | 4.11.0      | MIT         | peer       |
| [markdown-magic@^4.0.0](https://github.com/DavidWells/markdown-magic#readme) | Automatically update markdown files with content from external sources | 4.11.0      | MIT         | dev        |
| [prettier@^3.0.0](https://prettier.io)                                       | Prettier is an opinionated code formatter                              | 3.9.4       | MIT         | dev        |
| [vitest@^4.0.0](https://vitest.dev)                                          | Next generation testing framework powered by Vite                      | 4.1.9       | MIT         | dev        |

<!-- AUTO-GENERATED-CONTENT:END -->

## Options

- production (false) - include production dependencies
- dev (false) - include development dependencies
- optional (false) - include optional dependencies
- peer (false) - include peer dependencies
