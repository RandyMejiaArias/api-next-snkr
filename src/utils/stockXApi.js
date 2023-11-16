import axios from 'axios';

const stockXApi = axios.create({
  baseURL: 'https://stockx.com/api/p/e'
});

stockXApi.interceptors.request.use( (config) => {
  config.headers = {
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'x-operation-name': 'GetSearchResults',
    'accept-language': 'en-US',
    'App-Platform': 'Iron',
    'cookie': 'AhGKbfpFVM_DsYFW19gGrZ3mPHdSK4gUGz1oNczufy8-1700163701-0-ARX74q4NZxGVRC4B60o/uXqJPCn8kZyH2M3D1w4teJ59KdYjsFBW+Sx94zWuYbo1AKc9IOEcPlPy9al4YF3dzTM=',
    'selected-country': 'US',
    'x-stockx-session-id': 'a52dacd9-3011-4f14-a8b1-d2dfb1ae5aad',
    'sec-ch-ua-platform': '"Windows"',
    'apollographql-client-name': 'Iron',
    'sec-ch-ua-mobile': '?0',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://stockx.com/',
    'x-stockx-device-id': '589926b1-9167-4ddb-992f-8bee608a8c68',
    'apollographql-client-version': '2023.11.05.01',
    'App-Version': '2023.11.05.01'
  }

  return config
})
export default stockXApi;