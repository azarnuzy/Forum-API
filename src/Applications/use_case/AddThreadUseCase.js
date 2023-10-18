const AddThread = require('../../Domains/threads/entities/AddThread')

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload, owner) {
    const addThread = new AddThread(useCasePayload)
    await this._threadRepository.verifyThreadOwner(owner)
    const addedThread = await this._threadRepository.addThread(addThread)
    return addedThread
  }
}

module.exports = AddThreadUseCase
