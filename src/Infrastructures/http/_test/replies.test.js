const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah reply',
      }

      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'sebuah reply',
      }

      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      }

      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai'
      )
    })

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah reply',
      }

      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 401 when access token not contain correct credentials', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah reply',
      }

      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer wrong_token',
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Invalid token structure')
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah reply',
      }

      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-456',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-456',
        owner: userId,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah reply',
      }

      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 401 when access token not contain correct credentials', async () => {
      // Arrange
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: 'Bearer wrong_token',
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Invalid token structure')
    })

    it('should response 403 when user is not the reply owner', async () => {
      // Arrange
      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'user-456',
      })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: 'user-456',
        comment_id: 'comment-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Anda bukan pemilik reply ini')
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: userId,
        comment_id: 'comment-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-456/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: userId,
        comment_id: 'comment-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-456/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })

    it('should response 200 and delete reply', async () => {
      // Arrange
      const server = await createServer(container)

      const { accessToken, userId } =
        await ServerTestHelper.getAccessTokenAndIdUser({
          server,
        })

      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: userId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        thread_id: 'thread-123',
        owner: userId,
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah reply',
        owner: userId,
        comment_id: 'comment-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.message).toEqual('reply berhasil dihapus')
    })
  })
})
