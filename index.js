const DEFAULT_ORIGIN = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/'

export default (
  {
    token,
    origin = DEFAULT_ORIGIN
  } = {}
) => ({
  name: 'dadata',
  setup({onLoad, onMounted, onValueChanged, getValue, setQuery, form: {$http}}) {
    const syncQuery = () => setQuery(getValue())

    onMounted(syncQuery)

    onValueChanged(syncQuery)

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
          const response = await $http.post(
            url,
            data,
            { headers }
          )
          return response.data ? response.data : response.body
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
