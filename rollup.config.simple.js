import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const input = 'src/js/aos.js';

const ignoreScss = () => ({
  name: 'ignore-scss',
  resolveId(id) {
    if (id.endsWith('.scss') || id.endsWith('.sass')) {
      return id;
    }
    return null;
  },
  load(id) {
    if (id.endsWith('.scss') || id.endsWith('.sass')) {
      return 'export default {};';
    }
    return null;
  }
});

export default [
  {
    input,
    output: {
      file: pkg.browser,
      name: 'AOS',
      format: 'umd',
      sourcemap: false
    },
    plugins: [
      ignoreScss(),
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      }),
      uglify()
    ]
  },
  {
    input,
    external: Object.keys(pkg.dependencies),
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      ignoreScss(),
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
];
