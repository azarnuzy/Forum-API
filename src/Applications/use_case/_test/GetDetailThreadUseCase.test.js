const CommentRepository = require('../../../Domains/comments/CommentRepository')
const Comment = require('../../../Domains/comments/entities/Comment')
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const Reply = require('../../../Domains/replies/entities/Reply')
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
        is_delete: false,
      }),
      new Comment({
        id: 'comment-456',
        username: 'dicoding',
        content: 'comment content 2',
        date: new Date(),
        is_delete: true,
      }),
    ]

    const mockReplies = [
      new Reply({
        id: 'reply-123',
        owner: 'dicoding',
        content: 'reply content',
        date: new Date(),
        is_delete: false,
      }),
      new Reply({
        id: 'reply-456',
        owner: 'dicoding',
        content: 'reply content 2',
        date: new Date(),
        is_delete: true,
      }),
    ]

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockLikeCommentRepository = new LikeCommentRepository()

    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments))
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReplies))
    mockLikeCommentRepository.getLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1))

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
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
    expect(thread.comments[0].replies).toHaveLength(mockReplies.length)
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123'
    )
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      'comment-123'
    )
    expect(mockLikeCommentRepository.getLikeCount).toBeCalledWith('comment-123')
  })
})
