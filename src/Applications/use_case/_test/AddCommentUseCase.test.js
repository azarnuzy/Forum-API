const AddCommentUseCase = require('../AddCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedThred = require('../../../Domains/threads/entities/AddedThread')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content comment',
      owner: 'user-123',
      threadId: 'thread-123',
    }

    const mockAddedThread = new AddedThred({
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    })
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload)

    // Assert
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    })

    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      })
    )
  })
})
