class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute(useCasePayload) {
    await this._threadRepository.getThreadById(useCasePayload.threadId)
    await this._commentRepository.getCommentById(useCasePayload.commentId)
    await this._replyRepository.verifyReplyOwner(
      useCasePayload.replyId,
      useCasePayload.owner
    )
    await this._replyRepository.getReplyById(useCasePayload.replyId)
    await this._replyRepository.deleteReply(useCasePayload.replyId)
  }
}

module.exports = DeleteReplyUseCase
