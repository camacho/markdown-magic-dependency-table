'use strict'

const pkg = require('../__fixtures__/package.fixture')
const path = require('path');
const markdownMagic = require('markdown-magic')

const config = {
  transforms: {
    DEPENDENCYTABLE: require('markdown-magic-dependency-table')
  }
}


describe('markdown-magic-dependency-table', () => {

  it('generates a column of licenses by dependency', () => {
    const CONTENT = 0
    const markdownPath = path.resolve(__dirname, '..', '__mocks__', 'README.md')
    markdownMagic(markdownPath, config, (err, msg) => {
      expect(err).toBeNull()
      expect(msg[CONTENT].originalContent).toContain('**License**')
      expect(msg[CONTENT].originalContent).toContain('[MIT](https://spdx.org/licenses/MIT.html)')
      expect(msg[CONTENT].originalContent).toContain('[ISC](https://spdx.org/licenses/ISC.html)')
    })
  })

  it('displays "Not found" when a license cannot be detected', () => {
    const CONTENT = 0
    const markdownPath = path.resolve(__dirname, '..', '__mocks__', 'README.md')
    markdownMagic(markdownPath, config, (err, msg) => {
      expect(err).toBeNull()
      expect(msg[CONTENT].originalContent).toContain('None found')
    })
  })
})
