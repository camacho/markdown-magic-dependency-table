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
