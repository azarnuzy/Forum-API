const LikeCommentRepository = require('../LikeCommentRepository')

describe('LikeCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeCommentRepository = new LikeCommentRepository()

    // Action and Assert
    await expect(likeCommentRepository.likeComment({})).rejects.toThrowError(
      'LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(likeCommentRepository.unlikeComment({})).rejects.toThrowError(
      'LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(
      likeCommentRepository.verifyCommentLike({})
    ).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeCommentRepository.getLikeCount('')).rejects.toThrowError(
      'LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
