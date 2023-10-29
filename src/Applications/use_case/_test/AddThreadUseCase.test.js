const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThred = require('../../../Domains/threads/entities/AddedThread')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
      owner: 'user-123',
    }

    const mockAddedThread = new AddedThred({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    })

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    const expectedAddedThread = new AddedThred({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    })

    expect(addedThread).toStrictEqual(expectedAddedThread)

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    )
  })
})
