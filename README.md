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

<!-- AUTO-GENERATED-CONTENT:START (DEPENDENCYTABLE:dev=true) -->
| **Dependency** | **Description** | **Version** | **Type** | **License** |
| -------------- | --------------- | ----------- | -------- | -------- |
 | [findup@^0.1.5](https://github.com/Filirom1/findup#readme) | Walk up ancester's dir up to root | 0.1.5 | production | None found | 
 | [get-installed-path@^2.0.3](https://github.com/tunnckoCore/get-installed-path#readme) | Get installation path where the given package is installed. Works for globally and locally installed packages. Works on Windows too. | 2.1.1 | production | [MIT](https://spdx.org/licenses/MIT.html) | 
 | [semver@^5.3.0](https://github.com/npm/node-semver#readme) | The semantic version parser used by npm. | 5.4.1 | production | [ISC](https://spdx.org/licenses/ISC.html) | 
 | [jest@21.2.1](http://facebook.github.io/jest/) | Delightful JavaScript Testing. | 21.2.1 | dev | [MIT](https://spdx.org/licenses/MIT.html) | 
 | [jest-cli@21.2.1](http://facebook.github.io/jest/) | Delightful JavaScript Testing. | 21.2.1 | dev | [MIT](https://spdx.org/licenses/MIT.html) | 
 | [markdown-magic@^0.1.17](https://github.com/DavidWells/markdown-magic#readme) | Automatically update markdown files with content from external sources | 0.1.19 | dev | [MIT](https://spdx.org/licenses/MIT.html) | 
 | [prettier@^1.4.4](https://prettier.io) | Prettier is an opinionated code formatter | 1.7.3 | dev | [MIT](https://spdx.org/licenses/MIT.html) | 
<!-- AUTO-GENERATED-CONTENT:END -->

## Options
* production (true) - include production dependencies
* dev (false) - include development dependencies
* optional (false) - include optional dependencies
* peer (false) - include peer dependencies
