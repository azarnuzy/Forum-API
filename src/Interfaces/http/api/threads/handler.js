const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')

class ThreadsHandler {
  constructor(container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials

    request.payload.owner = credentialId

    const threadUseCase = await this._container.getInstance(
      AddThreadUseCase.name
    )

    const addedThread = await threadUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    })

    response.code(201)
    return response
  }
}

module.exports = ThreadsHandler
