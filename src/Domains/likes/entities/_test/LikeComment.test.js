const LikeComment = require('../LikeComment')

describe('a LikeComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123',
      commentId: 'comment-123',
    }

    expect(() => new LikeComment(payload)).toThrowError(
      'LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      owner: 'user-123',
      threadId: ['thread-123'],
      commentId: 'comment-123',
    }

    expect(() => new LikeComment(payload)).toThrowError(
      'LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create LikeComment object correctly', () => {
    const payload = {
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    const { owner, threadId, commentId } = new LikeComment(payload)

    expect(owner).toEqual(payload.owner)
    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
  })
})
