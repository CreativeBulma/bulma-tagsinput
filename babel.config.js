module.exports = {
  presets: [
    ['@babel/env'],
    ['minify', {
      'keepClassName': true,
      'keepFnName': true
    }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-decorators', {
      'legacy': true
    }],
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-block-scoping',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-parameters',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-default-from'
  ]
};