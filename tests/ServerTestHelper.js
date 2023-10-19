/* istanbul ignore file */
const ServerTestHelper = {
  async getAccessTokenAndIdUser({ server }) {
    const registerUserPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    }

    const loginPayload = {
      username: 'dicoding',
      password: 'secret',
    }

    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: registerUserPayload,
    })

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: loginPayload,
    })

    const { id: userId } = JSON.parse(registerResponse.payload).data.addedUser
    const { accessToken } = JSON.parse(loginResponse.payload).data
    return { userId, accessToken }
  },
}

module.exports = ServerTestHelper
