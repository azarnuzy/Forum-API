const AddReply = require('../../Domains/replies/entities/AddReply')

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute(useCasePayload) {
    await this._threadRepository.getThreadById(useCasePayload.threadId)
    await this._commentRepository.getCommentById(useCasePayload.commentId)

    const addedReply = await this._replyRepository.addReply(
      new AddReply(useCasePayload)
    )

    return addedReply
  }
}

module.exports = AddReplyUseCase
