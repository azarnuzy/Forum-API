const Comment = require('../Comment')

describe('a Comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'comment-123',
    }

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 123,
      content: 123,
      date: new Date(),
      is_delete: false,
    }

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'comment content',
      date: new Date(),
      is_delete: false,
    }

    // Action
    const { id, username, content, date, is_delete } = new Comment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(content).toEqual(payload.content)
    expect(date).toEqual(payload.date)
  })

  it('should create Comment object correctly when is_delete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'comment content',
      date: new Date(),
      is_delete: true,
    }

    // Action
    const { id, username, content, date, is_delete } = new Comment(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(content).toEqual('**komentar telah dihapus**')
    expect(date).toEqual(payload.date)
  })
})
