const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeCommentUseCase')

class LikesCommentHandler {
  constructor(container) {
    this._container = container
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this)
  }

  async putLikeCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const { commentId, threadId } = request.params

    const payload = {
      owner: credentialId,
      commentId,
      threadId,
    }

    const addLikeCommentUseCase = this._container.getInstance(
      AddLikeCommentUseCase.name
    )
    await addLikeCommentUseCase.execute(payload)

    const response = h.response({
      status: 'success',
    })

    return response
  }
}

module.exports = LikesCommentHandler
