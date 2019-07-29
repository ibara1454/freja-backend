import AnyProxy from 'anyproxy';

import { delay, deepMerge } from './util';

class ProxyServer {
  constructor(options) {
    const proxyServer = new AnyProxy.ProxyServer(options);
    proxyServer.on('ready', () => { /* */ });
    // eslint-disable-next-line no-console
    proxyServer.on('error', (e) => { console.error(e); });
    proxyServer.start();
  }
}

/**
 * Build a proxy server
 * @param {Object} options configuration of proxy server
 */
function buildServer(options = {}) {
  const { getRules, ...restOptions } = options;
  // requestDetail :=
  // {
  //   protocol: 'http',
  //   url: 'http://anyproxy.io/',
  //   requestOptions: {
  //     hostname: 'anyproxy.io',
  //     port: 80,
  //     path: '/',
  //     method: 'GET',
  //     headers: {
  //       'Host': 'anyproxy.io',
  //       'Proxy-Connection': 'keep-alive',
  //       'User-Agent': '...'
  //     }
  //   },
  //   requestData: '...',
  //   _req: { /* ... */}
  // }
  const rule = {
    summary: 'rule to hack request / response',

    // eslint-disable-next-line consistent-return
    * beforeSendRequest(requestDetail) {
      const rules = getRules();
      const firstMatch = rules.find(el => requestDetail.url.match(el.matcher));
      if (firstMatch !== undefined) {
        const { request } = firstMatch;
        if (request && request.delay) {
          yield delay(request.delay);
        }
        if (request && request.detail) {
          // Overrides origin request by matched rule
          const hackedRequest = deepMerge({}, requestDetail, request.detail);
          return hackedRequest;
        }
      }
    },
    // eslint-disable-next-line consistent-return
    * beforeSendResponse(requestDetail, responseDetail) {
      const rules = getRules();
      const firstMatch = rules.find(el => requestDetail.url.match(el.matcher));
      if (firstMatch !== undefined) {
        const { response } = firstMatch;
        if (response && response.delay) {
          yield delay(response.delay);
        }
        if (response && response.detail) {
          // Overrides origin response by matched rule
          const hackedResponse = { ...responseDetail.response, ...response.detail };
          return { response: hackedResponse };
        }
      }
    },
  };

  const defaultOptions = {
    port: 8001,
    rule,
    webInterface: {
      enable: true,
      webPort: 8002,
    },
    forceProxyHttps: false,
    wsIntercept: true, // disable websocket proxying
    silent: false,
  };
  return new ProxyServer({ ...defaultOptions, ...restOptions });
}

export default buildServer;
