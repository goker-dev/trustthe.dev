import { client } from './client/client.gen'

export * from './client/sdk.gen'
export * from './client/types.gen'

client.setConfig({
  baseUrl: process.env.API_URL,
  headers: {
    apiKey: process.env.API_KEY,
  },
})

client.interceptors.response.use((response) => {
  if (response.status === 200) {
    console.log(`request to ${response.url} was successful`)
  }
  return response
})
