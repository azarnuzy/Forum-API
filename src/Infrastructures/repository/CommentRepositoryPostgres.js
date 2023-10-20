const InvariantError = require('../../Commons/exceptions/InvariantError')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment(payloadComment) {
    const { content, threadId, owner } = payloadComment
    const id = `comment-${this._idGenerator()}`
    const is_delete = false

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, owner, content, is_delete],
    }

    const result = await this._pool.query(query)

    return new AddedComment({ ...result.rows[0] })
  }

  async getCommentById(id) {
    const query = {
      text: `SELECT comments.*, users.username FROM comments 
        LEFT JOIN users ON comments.owner = users.id
        WHERE comments.id = $1`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('comment tidak ditemukan')
    }

    return new AddedComment({ ...result.rows[0] })
  }
}

module.exports = CommentRepositoryPostgres
