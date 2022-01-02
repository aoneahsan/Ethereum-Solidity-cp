const { createServer } = require('http')
const next = require('next')
const routes = require('./routes')

const app = next({
  dev: process.env.NODE_ENV !== 'production'
})

const handler = routes.getRequestHandler(app)

const port = process.env.PORT || 3000
app.prepare().then(res => {
  createServer(handler).listen(port, err => {
    if (err) console.error(err)
    console.log(`Server Started @ localhost:${port}`)
  })
})
