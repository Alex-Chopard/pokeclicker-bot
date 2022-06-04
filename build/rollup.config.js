import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [nodeResolve()]
};
