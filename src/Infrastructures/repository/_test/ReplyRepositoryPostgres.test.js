const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddReply = require('../../../Domains/replies/entities/AddReply')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({ content: 'sebuah comment' })

      const addReply = new AddReply({
        content: 'sebuah reply',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      })
      const fakeIdGenerator = () => '123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await replyRepositoryPostgres.addReply(addReply)

      // Assert
      const replies = await RepliesTableTestHelper.getReplyById('reply-123')
      expect(replies).toHaveLength(1)
    })

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({ content: 'sebuah comment' })

      const addReply = new AddReply({
        content: 'sebuah reply',
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      })
      const fakeIdGenerator = () => '123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply)

      // Assert
      expect(addedReply.id).toEqual('reply-123')
      expect(addedReply.content).toEqual(addReply.content)
      expect(addedReply.owner).toEqual(addReply.owner)
    })
  })

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError if user is not the reply owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      })
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'user-456',
      })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({ content: 'sebuah comment' })
      await RepliesTableTestHelper.addReply({
        owner: 'user-123',
        content: 'sebuah reply',
      })

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456')
      ).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        replyRepositoryPostgres.getReplyById('reply-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return delted reply correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({ content: 'sebuah comment' })
      await RepliesTableTestHelper.addReply({
        owner: 'user-123',
        content: 'sebuah reply',
      })

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123')
      const reply = await RepliesTableTestHelper.getReplyById('reply-123')

      // Assert
      expect(reply[0].is_delete).toEqual(true)
    })
  })

  describe('getReplyById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        replyRepositoryPostgres.getReplyById('reply-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({ content: 'sebuah comment' })
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-123',
      })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const reply = await replyRepositoryPostgres.getReplyById('reply-123')

      // Assert
      expect(reply.id).toEqual('reply-123')
      expect(reply.content).toEqual('sebuah reply')
      expect(reply.owner).toEqual('user-123')
    })
  })

  describe('getRepliesByCommentId function', () => {
    it('should return get replies by comment id  correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentTableTestHelper.addComment({ content: 'sebuah comment' })
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply 1',
        owner: 'user-123',
      })
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        content: 'sebuah reply 2',
        owner: 'user-123',
      })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123'
      )

      // Assert
      expect(replies).toHaveLength(2)
      expect(replies[0].id).toEqual('reply-123')
      expect(replies[0].content).toEqual('sebuah reply 1')
      expect(replies[0].owner).toEqual('user-123')
      expect(replies[1].id).toEqual('reply-456')
      expect(replies[1].content).toEqual('sebuah reply 2')
      expect(replies[1].owner).toEqual('user-123')
    })
  })
})
