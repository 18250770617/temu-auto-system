(function () {
  const SOURCE = 'TEMU_COMPLIANCE_TEMPLATE_API_CAPTURE';
  const REPLAY_EVENT = 'TEMU_COMPLIANCE_TEMPLATE_REPLAY_API_CAPTURES';
  const ENDPOINTS = {
    queryDetail: '/ms/bg-flux-ms/compliance_property/query_detail',
    queryDynamicTemplate: '/ms/bg-flux-ms/compliance_property/query_dynamic_template',
    checkEditCompliance: '/ms/bg-flux-ms/compliance_property/check_edit_compliance',
    editCompliance: '/ms/bg-flux-ms/compliance_property/edit_compliance',
  };

  if (window.__TEMU_COMPLIANCE_TEMPLATE_PAGE_HOOK__) return;
  window.__TEMU_COMPLIANCE_TEMPLATE_PAGE_HOOK__ = true;

  function endpointName(url) {
    const text = String(url || '');
    return Object.entries(ENDPOINTS).find(([, path]) => text.includes(path))?.[0] || '';
  }

  function parseBody(body) {
    if (!body || typeof body !== 'string') return null;
    try {
      return JSON.parse(body);
    } catch (error) {
      return null;
    }
  }

  function postCapture(endpoint, url, requestBody, responseBody, status) {
    const payload = {
      source: SOURCE,
      endpoint,
      url: String(url || ''),
      status,
      requestBody: parseBody(requestBody),
      responseBody: parseBody(responseBody),
      capturedAt: new Date().toISOString(),
    };
    window.__TEMU_COMPLIANCE_TEMPLATE_API_CAPTURES__ = window.__TEMU_COMPLIANCE_TEMPLATE_API_CAPTURES__ || [];
    window.__TEMU_COMPLIANCE_TEMPLATE_API_CAPTURES__.push(payload);
    window.__TEMU_COMPLIANCE_TEMPLATE_API_CAPTURES__ = window.__TEMU_COMPLIANCE_TEMPLATE_API_CAPTURES__.slice(-20);
    window.postMessage(payload, window.location.origin);
  }

  window.addEventListener(REPLAY_EVENT, () => {
    (window.__TEMU_COMPLIANCE_TEMPLATE_API_CAPTURES__ || []).forEach((payload) => {
      window.postMessage({ ...payload, source: SOURCE }, window.location.origin);
    });
  });

  const originalFetch = window.fetch;
  window.fetch = async function patchedFetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url;
    const endpoint = endpointName(url);
    const requestBody = init?.body;
    const response = await originalFetch.apply(this, arguments);
    if (endpoint) {
      response.clone().text()
        .then((text) => postCapture(endpoint, url, requestBody, text, response.status))
        .catch(() => {});
    }
    return response;
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function patchedOpen(method, url) {
    this.__temuComplianceTemplateRequest = { method, url };
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function patchedSend(body) {
    const meta = this.__temuComplianceTemplateRequest || {};
    const endpoint = endpointName(meta.url);
    if (endpoint) {
      this.addEventListener('loadend', () => {
        postCapture(endpoint, meta.url, body, String(this.responseText || ''), this.status);
      });
    }
    return originalSend.apply(this, arguments);
  };
})();
