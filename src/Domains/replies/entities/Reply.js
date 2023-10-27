class Reply {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, content, owner, date } = payload

    this.id = id
    this.content = content
    this.owner = owner
    this.date = date
  }

  _verifyPayload({ id, content, owner, date }) {
    if (!id || !content || !owner || !date) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      !(date instanceof Date)
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Reply
