# Dependency table

Add a table of dependencies to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
npm i markdown-magic markdown-magic-dependency-table --save-dev
```

## Adding the plugin

See `example.js` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->
<!-- The below code snippet is automatically added from ./example.js -->
```js
const fs = require('fs');
const path = require('path');
const markdownMagic = require('markdown-magic');

const config = {
  transforms: {
    DEPENDENCYTABLE: require('./index.js'),
  },
};

const markdownPath = path.join(__dirname, 'README.md');
markdownMagic(markdownPath, config);
```
<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (DEPENDENCYTABLE) -->
| **Dependency** | **Description** | **Version** | **License** | **Type** |
| -------------- | --------------- | ----------- | ----------- | -------- |
 | [find-up@^2.1.0](https://github.com/sindresorhus/find-up) | Find a file by walking up parent directories | 2.1.0 | MIT | production | 
 | [semver@^5.3.0](https://github.com/npm/node-semver) | The semantic version parser used by npm. | 5.7.1 | ISC | production | 
 | [markdown-magic@>=0.1 <...](https://github.com/DavidWells/markdown-magic#readme) | Automatically update markdown files with content from external sources | 2.6.0 | MIT | peer | 
 | [prettier@^2.0.0](https://prettier.io) | Prettier is an opinionated code formatter | 2.6.1 | MIT | peer | 
 | [markdown-magic@>=0.1 <...](https://github.com/DavidWells/markdown-magic#readme) | Automatically update markdown files with content from external sources | 2.6.0 | MIT | dev | 
 | [prettier@^2.0.0](https://prettier.io) | Prettier is an opinionated code formatter | 2.6.1 | MIT | dev | 
<!-- AUTO-GENERATED-CONTENT:END -->

## Options
* production (false) - include production dependencies
* dev (false) - include development dependencies
* optional (false) - include optional dependencies
* peer (false) - include peer dependencies
