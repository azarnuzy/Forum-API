const pool = require('../src/Infrastructures/database/postgres/pool')
/* istanbul ignore file */

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'reply content',
    thread_id = 'thread-123',
    comment_id = 'comment-123',
    owner = 'user-123',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, thread_id, comment_id, owner, content, is_delete],
    }
    await pool.query(query)
  },

  async getReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)

    return result.rows
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1')
  },
}

module.exports = RepliesTableTestHelper
