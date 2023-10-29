const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const Reply = require('../../Domains/replies/entities/Reply')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply(payload) {
    const { content, threadId, commentId, owner } = payload
    const id = `reply-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, commentId, owner, content],
    }

    const result = await this._pool.query(query)

    return new AddedReply({ ...result.rows[0] })
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthorizationError('Anda bukan pemilik reply ini')
    }
  }

  async deleteReply(id) {
    const query = {
      text: `UPDATE replies SET is_delete = true WHERE id = $1`,
      values: [id],
    }

    await this._pool.query(query)
  }

  async getReplyById(replyId) {
    const query = {
      text: `SELECT id, content, owner, date, is_delete FROM replies WHERE id = $1`,
      values: [replyId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan')
    }

    return new Reply({ ...result.rows[0] })
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.*, users.username FROM replies 
            LEFT JOIN users ON replies.owner = users.id
            WHERE replies.comment_id = $1 ORDER BY replies.date ASC`,
      values: [commentId],
    }

    const result = await this._pool.query(query)

    return result.rows
  }
}

module.exports = ReplyRepositoryPostgres
