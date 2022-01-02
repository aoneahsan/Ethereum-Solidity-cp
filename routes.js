const routes = require('next-routes')()

routes
  .add('/compaigns/new', '/compaigns/new')
  .add('/compaigns/:address', '/compaigns/show')
  .add('/compaigns/:address/requests', '/compaigns/requests/list')
  .add('/compaigns/:address/requests/new', '/compaigns/requests/new')

module.exports = routes
