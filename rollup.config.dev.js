// rollup.config.js
import cjs from 'rollup-plugin-commonjs';
import html from 'rollup-plugin-gen-html';
import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

function getPlugins() {
  const plugins = [
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
    }),
    // resolve node_modules and native
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    // support cmj module in node_modules
    cjs({
      include: ['node_modules/**'],
    }),
    html({
      template: 'public/index.html',
      target: './dist/index.html',
      hash: false,
      script: './dist/bundle.js',
    }),
    livereload('dist'),
    serve('dist'),
  ];

  return plugins;
}

export default {
  input: 'src/index.ts',
  plugins: getPlugins(),
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
};
