module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 2 versions','iOS >= 7', 'Android >= 4']
    })
  ]
}