const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
  constructor(container) {
    this._container = container

    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
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

  async deleteCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const { commentId, threadId } = request.params

    const deleteCommentUseCase = await this._container.getInstance(
      DeleteCommentUseCase.name
    )

    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner: credentialId,
    })

    const response = h.response({
      status: 'success',
    })

    response.code(200)
    return response
  }
}
module.exports = CommentsHandler
