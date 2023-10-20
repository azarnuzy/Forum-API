const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const pool = require('../../database/postgres/pool')
const InvariantError = require('../../../Commons/exceptions/InvariantError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable()
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
      const comments = await CommentTableTestHelper.getCommentById(
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
    it('should throw InvariantError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-123')
      ).rejects.toThrowError(InvariantError)
    })

    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({
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
})
