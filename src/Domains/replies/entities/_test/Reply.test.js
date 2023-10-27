const Reply = require('../Reply')

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'reply content',
    }

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError(
      'REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 123,
      owner: true,
      date: 'ini waktu',
    }

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError(
      'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
      date: new Date(),
    }

    // Action
    const { id, content, owner, date } = new Reply(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
    expect(date).toEqual(payload.date)
  })
})
