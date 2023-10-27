const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'sebuah comment',
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
        url: '/threads/thread-123/comments',
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
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      )
    })

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment',
      }

      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
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
        content: 'sebuah comment',
      }

      const server = await createServer(container)

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer salah',
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
        content: 'sebuah comment',
      }

      const server = await createServer(container)

      const { accessToken } = await ServerTestHelper.getAccessTokenAndIdUser({
        server,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
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

    it('should response 201 and persisted comment', async () => {
      // Arrange

      const requestPayload = {
        content: 'sebuah comment',
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
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 status code when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 401 status code when access token not contain correct credentials', async () => {
      // Arrange
      const server = await createServer(container)

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: 'Bearer salah',
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Invalid token structure')
    })

    it('should response 403 status code when user is not the comment owner', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'dicoding-2',
      })

      const { accessToken } = await ServerTestHelper.getAccessTokenAndIdUser({
        server,
      })

      await ThreadTableTestHelper.addThread({
        title: 'sebuah thread',
        owner: 'user-456',
      })
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-456',
        threadId: 'thread-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.message).toEqual('Anda bukan pemilik comment ini')
    })

    it('should response 404 status code when thread not found', async () => {
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

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: userId,
        threadId: 'thread-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-456/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 200 and delete comment', async () => {
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

      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: userId,
        threadId: 'thread-123',
      })

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.message).toEqual('comment berhasil dihapus')
    })
  })
})
