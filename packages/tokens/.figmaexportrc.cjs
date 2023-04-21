const path = require('path'),
  fileId = process.argv.at(4);
  theme = process.argv.at(5);

module.exports = {
  commands: [
    [
      'components',
      {
        fileId,
        onlyFromPages: ['Custom Icons'],
        transformers: [
          require('@figma-export/transform-svg-with-svgo')({
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false
                  }
                }
              },
              {
                name: 'removeAttrs',
                params: {
                  attrs: 'fill'
                }
              },
              {
                name: 'removeDimensions',
                active: true
              }
            ]
          })
        ],
        outputters: [
          require('@figma-export/output-components-as-svg')({
            output: `./src/themes/${theme}/icons`,
            getDirname: (options) => `.${path.sep}${options.dirname}`
          })
        ]
      }
    ]
  ]
};