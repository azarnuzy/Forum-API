const RepliesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'replies',
  version: '1.0.0',
  register: async (server, { container }) => {
    const handler = new RepliesHandler(container)
    server.route(routes(handler))
  },
}
