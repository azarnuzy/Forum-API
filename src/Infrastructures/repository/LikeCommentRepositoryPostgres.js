const LikeCommentRepository = require('../../Domains/likes/LikeCommentRepository')

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async likeComment({ threadId, commentId, owner }) {
    const id = `like-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, threadId, commentId, owner],
    }

    await this._pool.query(query)
  }

  async unlikeComment({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    }

    await this._pool.query(query)
  }

  async verifyCommentLike({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    }

    const result = await this._pool.query(query)

    console.log(result.rowCount, commentId, owner)

    if (result.rowCount) {
      return true
    }

    return false
  }

  async getLikeCount(commentId) {
    const query = {
      text: 'SELECT COUNT(id) FROM likes WHERE comment_id = $1',
      values: [commentId],
    }

    const result = await this._pool.query(query)

    return Number(result.rows[0].count)
  }
}

module.exports = LikeCommentRepositoryPostgres
