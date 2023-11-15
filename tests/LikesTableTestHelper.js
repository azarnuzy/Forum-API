/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async likeComment({
    id = 'like-123',
    owner = 'user-123',
    commentId = 'comment-123',
    threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, threadId, commentId, owner],
    }

    await pool.query(query)
  },

  async unlikeComment(id) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    }

    await pool.query(query)
  },

  async getLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    }

    const { rows } = await pool.query(query)

    return rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1')
  },
}
