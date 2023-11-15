const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddedThred = require('../../../Domains/threads/entities/AddedThread')
const AddLikeCommentUseCase = require('../AddLikeCommentUseCase')

describe('AddLikeCommentUseCase', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    const mockAddedThread = new AddedThred({
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    })
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content comment',
      owner: useCasePayload.owner,
    })
    const mockLikedComment = {
      status: 'success',
    }

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockLikeCommentRepository = new LikeCommentRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))
    mockLikeCommentRepository.verifyCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false))
    mockLikeCommentRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockLikedComment))

    const getLikeCommentUseCase = new AddLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    })

    // Action
    const likedComment = await getLikeCommentUseCase.execute(useCasePayload)

    // Assert
    const expectedLikedComment = {
      status: 'success',
    }

    expect(likedComment).toStrictEqual(expectedLikedComment)
  })

  it('should orchestrating the add unlike comment action correctly when comment already liked', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    const mockAddedThread = new AddedThred({
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    })
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content comment',
      owner: useCasePayload.owner,
    })
    const mockUnLikedComment = {
      status: 'success',
    }

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockLikeCommentRepository = new LikeCommentRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))
    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))
    mockLikeCommentRepository.verifyCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true))
    mockLikeCommentRepository.unlikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUnLikedComment))

    const getLikeCommentUseCase = new AddLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    })

    // Action
    const likedComment = await getLikeCommentUseCase.execute(useCasePayload)

    // Assert
    const expectedUnLikedComment = {
      status: 'success',
    }

    expect(likedComment).toStrictEqual(expectedUnLikedComment)
  })
})
