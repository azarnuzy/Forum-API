const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddedThred = require('../../../Domains/threads/entities/AddedThread')
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

    const mockAddedReply = new AddedReply({
      id: useCasePayload.replyId,
      content: 'content reply',
      owner: useCasePayload.owner,
    })

    const mockAddedThread = new AddedThred({
      id: useCasePayload.threadId,
      title: 'title',
      owner: useCasePayload.owner,
    })
    const mockAddedComment = new AddedComment({
      id: useCasePayload.commentId,
      content: 'content comment',
      owner: useCasePayload.owner,
    })

    const mockReplyRepository = new ReplyRepository()
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))
    mockReplyRepository.getReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyReplyOwner = jest
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
