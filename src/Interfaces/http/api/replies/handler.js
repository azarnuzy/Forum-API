const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase')

class RepliesHandler {
  constructor(container) {
    this._container = container
    this.postReplyHandler = this.postReplyHandler.bind(this)
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this)
  }

  async postReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    request.payload.owner = credentialId
    request.payload.threadId = request.params.threadId
    request.payload.commentId = request.params.commentId
    const addReplyUseCase = await this._container.getInstance(
      AddReplyUseCase.name
    )
    const addedReply = await addReplyUseCase.execute(request.payload)
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const { replyId, threadId, commentId } = request.params
    const deleteReplyUseCase = await this._container.getInstance(
      DeleteReplyUseCase.name
    )
    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner: credentialId,
    })
    const response = h.response({
      status: 'success',
      message: 'reply berhasil dihapus',
    })
    response.code(200)
    return response
  }
}

module.exports = RepliesHandler
