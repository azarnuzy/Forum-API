const AddComment = require('../AddComment')

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content comment',
    }

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 123,
      threadId: 123,
    }

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'content comment',
      owner: 'user-123',
      threadId: 'thread-123',
    }

    // Action
    const { content, owner, threadId } = new AddComment(payload)

    // Assert
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(threadId).toEqual(payload.threadId)
  })
})
