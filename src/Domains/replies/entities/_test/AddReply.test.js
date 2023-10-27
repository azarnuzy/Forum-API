const AddReply = require('../AddReply')

describe('an AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'reply content',
    }

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: true,
      threadId: 123,
      commentId: 123,
    }

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create addReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply content',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    // Action
    const { content, owner, threadId, commentId } = new AddReply(payload)

    // Assert
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
  })
})
