const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('a DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    }
    const expectedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    })

    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve())
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve())
    mockCommentRepository.getCommentById = jest.fn(() =>
      Promise.resolve(expectedComment)
    )
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })
    // Action
    await deleteCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    )
    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId
    )
  })
})
