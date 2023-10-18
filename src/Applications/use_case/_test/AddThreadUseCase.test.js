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
    }

    const mockAddedThread = new AddedThred({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyThreadOwner = jest.fn(() => Promise.resolve())
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    })

    // Action
    const addedThread = await getThreadUseCase.execute(
      useCasePayload,
      'user-123'
    )

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread)

    expect(mockThreadRepository.verifyThreadOwner).toBeCalledWith('user-123')
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    )
  })
})
