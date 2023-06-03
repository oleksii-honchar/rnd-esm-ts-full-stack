const logHeader = "[webpack:config:snippet]".cyan;
console.log(logHeader,"'Externals' loaded");

module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
  }
};
