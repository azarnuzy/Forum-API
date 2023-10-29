const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddReply = require('../../../Domains/replies/entities/AddReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddedThred = require('../../../Domains/threads/entities/AddedThread')
const AddReplyUseCase = require('../AddReplyUseCase')

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'reply content',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    })

    const mockAddedThread = new AddedThred({
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    })
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content comment',
      owner: 'user-123',
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))

    const getReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    })

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload)

    // Assert
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    })

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(addedReply).toStrictEqual(expectedAddedReply)
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
      })
    )
  })
})
