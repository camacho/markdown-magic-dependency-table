# Install command plugin

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
| **Dependency** | **Description** | **Version** | **Type** |
| -------------- | --------------- | ----------- | -------- |
 | [findup@^0.1.5](https://github.com/Filirom1/findup) | Walk up ancester's dir up to root | 0.1.5 | production | 
 | [get-installed-path@^2.0.3](https://npmjs.org/package/get-installed-path) | Get installation path where the given package is installed. Works for globally and locally installed packages. Works on Windows too. | 2.0.3 | production | 
 | [semver@^5.3.0](https://github.com/npm/node-semver) | The semantic version parser used by npm. | 5.3.0 | production | 
 | [markdown-magic@^0.1.17](https://npmjs.org/package/markdown-magic) | Automatically update markdown files with content from external sources | 0.1.17 | dev | 
 | [prettier@^1.4.4](https://npmjs.org/package/prettier) | Prettier is an opinionated JavaScript formatter | 1.4.4 | dev | 
<!-- AUTO-GENERATED-CONTENT:END -->

## Options
* production (true) - include production dependencies
* dev (false) - include development dependencies
* optional (false) - include optional dependencies
* peer (false) - include peer dependencies
