const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')

class CommentsHandler {
  constructor(container) {
    this._container = container

    this.postCommentHandler = this.postCommentHandler.bind(this)
  }

  async postCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials

    request.payload.owner = credentialId
    request.payload.threadId = request.params.threadId
    const commentUseCase = await this._container.getInstance(
      AddCommentUseCase.name
    )

    const addedComment = await commentUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    })

    response.code(201)
    return response
  }
}
module.exports = CommentsHandler
