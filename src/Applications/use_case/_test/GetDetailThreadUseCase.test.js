const CommentRepository = require('../../../Domains/comments/CommentRepository')
const Comment = require('../../../Domains/comments/entities/Comment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const Thread = require('../../../Domains/threads/entities/Thread')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'title thread',
      body: 'body thread',
      date: new Date(),
      username: 'dicoding',
    })

    const mockComments = [
      new Comment({
        id: 'comment-123',
        username: 'dicoding',
        content: 'comment content',
        date: new Date(),
        isDeleted: false,
      }),
      new Comment({
        id: 'comment-456',
        username: 'dicoding',
        content: 'comment content 2',
        date: new Date(),
        isDeleted: true,
      }),
    ]

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments))

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })

    // Action
    const thread = await getDetailThreadUseCase.execute('thread-123')

    // Assert
    expect(thread.id).toEqual(mockThread.id)
    expect(thread.title).toEqual(mockThread.title)
    expect(thread.body).toEqual(mockThread.body)
    expect(thread.date).toEqual(mockThread.date)
    expect(thread.username).toEqual(mockThread.username)
    expect(thread.comments).toHaveLength(mockComments.length)
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123'
    )
  })
})
