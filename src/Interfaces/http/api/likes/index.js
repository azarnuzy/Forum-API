const LikesCommentHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { container }) => {
    const handler = new LikesCommentHandler(container)
    server.route(routes(handler))
  },
}
