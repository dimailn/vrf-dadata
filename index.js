const DEFAULT_ORIGIN = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest'

export default (
  {
    token,
    origin = DEFAULT_ORIGIN
  } = {}
) => ({
  name: 'dadata',
  setup({onLoad, form: {$http}}) {
    onLoad(async ({query, entity, limit}) => {
      const data = {
        query,
        count: limit
      }

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Token ${token}`
      } else if (origin === DEFAULT_ORIGIN) {
        console.error('[vrf-dadata] You need to specify token to make Dadata requests')
      }

      const url = `${origin}/${entity}`

      const load = async () => {
        if ($http) {
          const {data} = await $http.post(
            url,
            data,
            { headers }
          )
          return data
        } else {
          const response = await fetch(
            url,
            {
              method: 'POST',
              body: JSON.stringify(data),
              headers
            }
          )

          const json = await response.json()

          return json
        }
      }

      const {suggestions} = await load()

      return suggestions
    })
  }
})
