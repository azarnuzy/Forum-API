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
    return this._likeCommentRepository.addLikeComment(likeComment)
  }
}

module.exports = AddLikeCommentUseCase
