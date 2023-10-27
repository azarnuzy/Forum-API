const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      }

      const server = await createServer(container)

      const { accessToken } = await ServerTestHelper.getAccessTokenAndIdUser({
        server,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
      }

      const server = await createServer(container)

      const { accessToken } = await ServerTestHelper.getAccessTokenAndIdUser({
        server,
      })

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: ['sebuah body thread'],
      }

      const server = await createServer(container)

      const { accessToken } = await ServerTestHelper.getAccessTokenAndIdUser({
        server,
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      )
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 status code when  thread not found', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 200 and return correct detail thread', async () => {
      // Arrange
      const server = await createServer(container)

      await UsersTableTestHelper.addUser({ username: 'dicoding' })
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
        is_delete: false,
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'sebuah comment 2',
        owner: 'user-123',
        threadId: 'thread-123',
        is_delete: true,
      })
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')

      expect(responseJson.data.thread).toBeDefined()
      expect(responseJson.data.thread.id).toEqual('thread-123')
      expect(responseJson.data.thread.title).toEqual('title')
      expect(responseJson.data.thread.body).toEqual('body')
      expect(responseJson.data.thread.username).toEqual('dicoding')
      expect(responseJson.data.thread.comments).toHaveLength(2)
      expect(responseJson.data.thread.comments[0].id).toEqual('comment-123')
      expect(responseJson.data.thread.comments[0].content).toEqual(
        'sebuah comment'
      )
      expect(responseJson.data.thread.comments[0].username).toEqual('dicoding')
      expect(responseJson.data.thread.comments[1].id).toEqual('comment-456')
      expect(responseJson.data.thread.comments[1].content).toEqual(
        '**komentar telah dihapus**'
      )
      expect(responseJson.data.thread.comments[1].username).toEqual('dicoding')
    })
  })
})
