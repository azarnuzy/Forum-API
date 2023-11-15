const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const LikeComment = require('../../../Domains/likes/entities/LikeComment')
const pool = require('../../database/postgres/pool')

const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres')

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('likeComment function', () => {
    it('should persist add like comment', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({ content: 'sebuah comment' })

      const likeComment = new LikeComment({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      })

      const fakeIdGenerator = () => '123'
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // action
      await likeCommentRepositoryPostgres.likeComment(likeComment)

      // assert
      const likes = await LikesTableTestHelper.getLikeById('like-123')
      expect(likes).toHaveLength(1)
    })
  })

  describe('unlikeComment function', () => {
    it('should persist unlike comment', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({ content: 'sebuah comment' })
      await LikesTableTestHelper.likeComment({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      })

      const fakeIdGenerator = () => '123'
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // action
      await likeCommentRepositoryPostgres.unlikeComment('like-123')

      // assert
      const likes = await LikesTableTestHelper.getLikeById('like-123')
      expect(likes).toHaveLength(0)
    })
  })

  describe('verifyCommentLike function', () => {
    it('should return true if comment is liked', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({ content: 'sebuah comment' })
      await LikesTableTestHelper.likeComment({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      })

      await LikesTableTestHelper.getLikeById('like-123')

      const fakeIdGenerator = () => '123'
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // action
      const isLiked = await likeCommentRepositoryPostgres.verifyCommentLike({
        commentId: 'comment-123',
        owner: 'user-123',
      })

      // assert
      expect(isLiked).toEqual(true)
    })

    it('should return false if comment is not liked', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({ title: 'sebuah thread' })
      await CommentsTableTestHelper.addComment({ content: 'sebuah comment' })
      await LikesTableTestHelper.likeComment({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      })

      const fakeIdGenerator = () => '123'
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // action
      const isLiked = await likeCommentRepositoryPostgres.verifyCommentLike({
        commentId: 'comment-456',
        owner: 'user-123',
      })

      // assert
      expect(isLiked).toEqual(false)
    })
  })
})
