const path = require('path')
const ts = require('rollup-plugin-typescript2')
const dts = require('rollup-plugin-dts').default

const resolve = url => path.resolve(__dirname, url)

module.exports = [
  {
    input: './src/core/index.ts',
    output: [
      {file: resolve('lib/index.js'), format: 'umd', name: 'ys'},
      {file: resolve('lib/index.esm.js'), format: 'esm'},
      {file: resolve('build/index.cjs.js'), format: 'cjs'}
    ],
    plugins: [ts()],
    watch: {exclude: 'node_modules/**'}
  },
  {
    input: './src/core/index.ts',
    output: {file: resolve('lib/index.d.ts')},
    plugins: [dts()]
  }
]