const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const pool = require('../../database/postgres/pool')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })

      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      })
      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await commentRepositoryPostgres.addComment(addComment)

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById(
        'comment-123'
      )
      expect(comments).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      })
      const fakeIdGenerator = () => '123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      )

      // Assert
      expect(addedComment.id).toEqual('comment-123')
      expect(addedComment.content).toEqual(addComment.content)
      expect(addedComment.owner).toEqual(addComment.owner)
    })
  })

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-123'
      )

      // Assert
      expect(comment.id).toEqual('comment-123')
      expect(comment.content).toEqual('sebuah comment')
      expect(comment.owner).toEqual('user-123')
    })
  })

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when delete comment not owned by owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'dicoding')
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when delete comment owned by owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return deleted comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123')
      const comment = await CommentsTableTestHelper.getCommentById(
        'comment-123'
      )

      // Assert
      expect(comment[0].is_delete).toEqual(true)
    })
  })

  describe('getCommentsByThreadId function', () => {
    it('should return get comments by thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
        is_delete: false,
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'sebuah comment 2',
        threadId: 'thread-123',
        owner: 'user-123',
        is_delete: true,
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      )

      // Assert
      expect(comments).toHaveLength(2)
      expect(comments[0]).toEqual({
        id: 'comment-123',
        username: 'dicoding',
        date: expect.any(Date),
        content: 'sebuah comment',
        is_delete: false,
      })
      expect(comments[1]).toEqual({
        id: 'comment-456',
        username: 'dicoding',
        date: expect.any(Date),
        content: 'sebuah comment 2',
        is_delete: true,
      })
    })
  })
})
