const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange

      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const addThread = new AddThread({
        title: 'title',
        body: 'body',
        owner: 'user-123',
      })
      const fakeIdGenerator = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await threadRepositoryPostgres.addThread(addThread)

      // Assert
      const threads = await ThreadTableTestHelper.getThreadById('thread-123')
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      const addThread = {
        title: 'title',
        body: 'body',
        owner: 'user-123',
      }
      const fakeIdGenerator = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread)

      // Assert
      expect(addedThread.id).toEqual('thread-123')
      expect(addedThread.title).toEqual('title')
      expect(addedThread.owner).toEqual('user-123')
    })
  })

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      })

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123')

      // Assert
      expect(thread.id).toEqual('thread-123')
      expect(thread.title).toEqual('title')
      expect(thread.owner).toEqual('user-123')
    })
  })

  describe('getDetailThreadById function', () => {
    it('should throw NotFoundError when detail thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getDetailThreadById('thread-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return detail thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      })

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getDetailThreadById(
        'thread-123'
      )

      // Assert
      expect(thread.id).toEqual('thread-123')
      expect(thread.title).toEqual('title')
      expect(thread.body).toEqual('body')
      expect(thread.username).toEqual('dicoding')
    })
  })
})
