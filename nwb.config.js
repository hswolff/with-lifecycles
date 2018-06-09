module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'withLifecycles',
      externals: {
        react: 'React'
      }
    }
  }
}
