const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    const mockReplyRepository = new ReplyRepository()
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    // Action
    await deleteReplyUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    )
    expect(mockReplyRepository.getReplyById).toBeCalledWith(
      useCasePayload.replyId
    )
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      useCasePayload.replyId
    )
  })
})
