class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository
  }

  async execute(useCasePayload) {
    await this._replyRepository.verifyReplyOwner(
      useCasePayload.replyId,
      useCasePayload.owner
    )
    await this._replyRepository.getReplyById(useCasePayload.replyId)
    await this._replyRepository.deleteReply(useCasePayload.replyId)
  }
}

module.exports = DeleteReplyUseCase
