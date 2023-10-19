const InvariantError = require('../../Commons/exceptions/InvariantError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread(payload) {
    const { title, body, owner } = payload
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, owner, title, body],
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.*, users.username FROM threads 
        LEFT JOIN users ON threads.owner = users.id
        WHERE threads.id = $1`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('thread tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres