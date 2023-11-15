const LikeComment = require('../../Domains/likes/entities/LikeComment')

class AddLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._likeCommentRepository = likeCommentRepository
  }

  async execute(useCasePayload) {
    const likeComment = new LikeComment(useCasePayload)
    await this._threadRepository.getThreadById(likeComment.threadId)
    await this._commentRepository.getCommentById(likeComment.commentId)

    const isLikeExist = await this._likeCommentRepository.verifyCommentLike(
      likeComment.commentId,
      likeComment.owner
    )

    if (isLikeExist) {
      return this._likeCommentRepository.unlikeComment(
        likeComment.commentId,
        likeComment.owner
      )
    }
    return this._likeCommentRepository.addLikeComment(
      likeComment.commentId,
      likeComment.owner
    )
  }
}

module.exports = AddLikeCommentUseCase
