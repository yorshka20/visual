// rollup.config.js
import sourceMaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';
import html from 'rollup-plugin-gen-html';

function getPlugins() {
  const plugins = [
    sourceMaps(),
    nodeResolve({
      mainFields: 'module',
      browser: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      clean: true,
    }),
    cjs({
      include: ['node_modules/**'],
    }),
    livereload(),
    serve({
      open: true,
      port: 8080,
      contentBase: '',
    }),
    uglify(),
    html({
      template: 'index.html',
      target: './dist/index.html',
      hash: false,
    }),
  ];

  return plugins;
}

export default {
  input: 'src/index.ts',
  plugins: getPlugins(),
  sourceMap: true,
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
};
