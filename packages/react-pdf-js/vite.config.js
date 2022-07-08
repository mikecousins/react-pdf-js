const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: '@mikecousins/react-pdf',
      fileName: (format) => `mikecousins-react-pdf.${format}.js`
    },
  }
})
