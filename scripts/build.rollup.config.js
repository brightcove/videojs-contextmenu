import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';

const pkg = require(path.resolve(__dirname, '../package.json'));

export default {
  moduleName: 'videojsContextmenu',
  entry: 'src/plugin.js',
  dest: 'dist/videojs-contextmenu.js',
  format: 'umd',
  external: ['video.js'],
  globals: {
    'video.js': 'videojs'
  },
  legacy: true,
  plugins: [
    replace({
      delimiters: ['__', '__'],
      include: 'src/plugin.js',
      VERSION: pkg.version
    }),
    resolve({
      browser: true,
      main: true,
      jsnext: true
    }),
    commonjs({
      sourceMap: false
    }),
    babel({
      babelrc: false,
      presets: [
        'es3',
        ['es2015', {
          loose: true,
          modules: false
        }]
      ],
      plugins: [
        'external-helpers',
        'transform-object-assign'
      ]
    })
  ]
};
