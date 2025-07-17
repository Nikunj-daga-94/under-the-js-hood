import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

const name = 'MyPromise';

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} License.
 */`;

export default {
  input: 'src/index.js',
  output: [
    // CommonJS
    {
      file: pkg.main,
      format: 'cjs',
      banner,
      exports: 'named',
    },
    // ES Module
    {
      file: pkg.module,
      format: 'esm',
      banner,
    },
    // UMD
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name,
      banner,
      globals: {
        // Add any global dependencies here
      },
    },
    // Minified UMD
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name,
      banner,
      plugins: [terser()],
      globals: {
        // Add any global dependencies here
      },
    },
  ],
  plugins: [
    nodeResolve({
      extensions,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
};
