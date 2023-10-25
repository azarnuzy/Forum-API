const InvariantError = require('../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThred = require('../../Domains/threads/entities/AddedThread')
const Thread = require('../../Domains/threads/entities/Thread')

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

    return new AddedThred({ ...result.rows[0] })
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
      throw new NotFoundError('thread tidak ditemukan')
    }

    return new AddedThred({ ...result.rows[0] })
  }

  async getDetailThreadById(id) {
    const query = {
      text: `  
        SELECT 
          threads.id, threads.title, threads.body, 
          threads.date, users.username
        FROM threads 
        LEFT JOIN users ON threads.owner = users.id
        WHERE threads.id = $1
        GROUP BY threads.id, users.username`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return new Thread({ ...result.rows[0] })
  }
}

module.exports = ThreadRepositoryPostgres
