(function () {
  const API_BASE_URL = 'http://127.0.0.1:8787';
  const BUTTON_ID = 'temu-compliance-template-button';
  const STYLE_SCOPE = 'temu-compliance-template';
  const LOG_PREFIX = '[TemuComplianceTemplate]';
  const SCRIPT_VERSION = '0.3.0';
  const UNKNOWN_COMPANY_ID = 'unknown-company';
  const UNKNOWN_SHOP_ID = 'unknown-shop';
  const API_CAPTURE_SOURCE = 'TEMU_COMPLIANCE_TEMPLATE_API_CAPTURE';
  const API_CAPTURE_REPLAY_EVENT = 'TEMU_COMPLIANCE_TEMPLATE_REPLAY_API_CAPTURES';
  const complianceApiSnapshots = new Map();

  const TEXT = {
    editTitle: '\u7f16\u8f91\u5408\u89c4\u4fe1\u606f',
    setTemplate: '\u8bbe\u4e3a\u6a21\u677f',
    modalTitle: '\u4fdd\u5b58\u5408\u89c4\u4fe1\u606f\u6a21\u677f',
    namePlaceholder: '\u8bf7\u8f93\u5165\u6a21\u677f\u540d\u79f0',
    confirm: '\u786e\u8ba4',
    cancel: '\u53d6\u6d88',
    getSku: '\u83b7\u53d6\u8d27\u53f7',
    list: '\u67e5\u770b\u5df2\u4fdd\u5b58\u6a21\u677f',
    replace: '\u66ff\u6362\u539f\u6a21\u677f',
    nameRequired: '\u8bf7\u5148\u8f93\u5165\u6a21\u677f\u540d\u79f0',
    duplicate: '\u6a21\u677f\u540d\u79f0\u5df2\u5b58\u5728\uff0c\u8bf7\u91cd\u65b0\u53d6\u540d\u6216\u66ff\u6362\u539f\u6a21\u677f',
    saved: '\u6a21\u677f\u5df2\u4fdd\u5b58',
    replaced: '\u539f\u6a21\u677f\u5df2\u66ff\u6362',
    saveFailed: '\u4fdd\u5b58\u5931\u8d25',
    listTitle: '\u5df2\u4fdd\u5b58\u7684\u6a21\u677f',
    emptyList: '\u6682\u65e0\u5df2\u4fdd\u5b58\u6a21\u677f',
    viewJson: '\u67e5\u770b JSON',
    delete: '\u5220\u9664',
    dryRun: '\u6f14\u7ec3\u66f4\u6539',
    apply: '\u771f\u5b9e\u4fdd\u5b58',
    changePreviewTitle: '\u6a21\u677f\u66f4\u6539\u9884\u89c8',
    prepareChangeFailed: '\u751f\u6210\u66f4\u6539\u9884\u89c8\u5931\u8d25',
    dryRunFailed: '\u6f14\u7ec3\u5931\u8d25',
    dryRunDone: '\u6f14\u7ec3\u5b8c\u6210',
    applyConfirm: '\u5c06\u771f\u5b9e\u4fdd\u5b58\u5f53\u524d\u5546\u54c1\u7684\u5408\u89c4\u4fe1\u606f\uff0c\u8bf7\u786e\u8ba4\u5df2\u6838\u5bf9\u5dee\u5f02\u3002',
    applyFailed: '\u771f\u5b9e\u4fdd\u5b58\u5931\u8d25',
    applyDone: '\u771f\u5b9e\u4fdd\u5b58\u5df2\u5b8c\u6210',
    notApplicableTemplate: '\u8be5\u6a21\u677f\u7f3a\u5c11 query_detail \u5feb\u7167\uff0c\u8bf7\u91cd\u65b0\u4ece\u7f16\u8f91\u62bd\u5c49\u4fdd\u5b58\u4e00\u6b21',
    noQueryDetailSnapshot: '\u672a\u6355\u83b7\u5230\u5f53\u524d\u5546\u54c1 query_detail\uff0c\u8bf7\u91cd\u65b0\u6253\u5f00\u7f16\u8f91\u62bd\u5c49',
    close: '\u5173\u95ed',
    back: '\u8fd4\u56de',
    searchPlaceholder: '\u641c\u7d22\u6a21\u677f\u540d\u3001SPU\u3001\u5546\u54c1\u6807\u9898',
    search: '\u641c\u7d22',
    clear: '\u6e05\u7a7a',
    previousPage: '\u4e0a\u4e00\u9875',
    nextPage: '\u4e0b\u4e00\u9875',
    pageSummary: '\u7b2c {page}/{totalPages} \u9875\uff0c\u5171 {total} \u6761',
    deleted: '\u6a21\u677f\u5df2\u5220\u9664',
    apiOffline: '\u672c\u5730 API \u672a\u8fde\u63a5\uff0c\u8bf7\u5148\u542f\u52a8 npm run dev:api',
    noSpu: '\u672a\u627e\u5230\u5f53\u524d\u6a21\u677f\u7684 SPU',
    gettingSku: '\u83b7\u53d6\u4e2d...',
    skuNotFound: '\u672a\u627e\u5230\u5bf9\u5e94\u8d27\u53f7',
    getSkuFailed: '\u83b7\u53d6\u8d27\u53f7\u5931\u8d25',
  };

  const COMPLIANCE_TITLES = [
    { label: '\u52a0\u5dde 65 \u53f7\u63d0\u6848', key: 'californiaProposition65' },
    { label: '\u6b27\u76df\u8d1f\u8d23\u4eba', key: 'euResponsiblePerson' },
    { label: '\u5236\u9020\u5546\u4fe1\u606f', key: 'manufacturerInfo' },
    { label: '\u571f\u8033\u5176\u8d1f\u8d23\u4eba', key: 'turkeyResponsiblePerson' },
    { label: '\u5305\u88c5\u6750\u6599\u4fe1\u606f\u6536\u96c6', key: 'packagingMaterialInfo' },
    { label: '\u97e9\u56fd\u516c\u793a\u4fe1\u606f', key: 'koreaDisclosureInfo' },
    { label: '\u5176\u4ed6\u5408\u89c4\u4fe1\u606f', key: 'otherComplianceInfo' },
  ];

  function normalizeText(value) {
    return String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function isVisible(element) {
    if (!element || !(element instanceof Element)) return false;
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function getText(element) {
    return normalizeText(element?.innerText || element?.textContent || '');
  }

  function handleApiCapture(event) {
    if (event.source !== window || event.origin !== window.location.origin) return;
    const snapshot = event.data;
    if (!snapshot || snapshot.source !== API_CAPTURE_SOURCE || !snapshot.endpoint) return;

    const normalized = normalizeApiSnapshot(snapshot);
    const spuId = apiSnapshotSpuId(normalized);
    const keys = [
      `${normalized.endpoint}:latest`,
      spuId ? `${normalized.endpoint}:${spuId}` : '',
    ].filter(Boolean);

    keys.forEach((key) => complianceApiSnapshots.set(key, normalized));
    window.__TEMU_COMPLIANCE_TEMPLATE_API_SNAPSHOTS__ = Array.from(complianceApiSnapshots.entries())
      .map(([key, value]) => ({ key, endpoint: value.endpoint, spuId: apiSnapshotSpuId(value), capturedAt: value.capturedAt }));
  }

  function normalizeApiSnapshot(snapshot) {
    return {
      endpoint: String(snapshot.endpoint || ''),
      url: String(snapshot.url || ''),
      status: snapshot.status || 0,
      capturedAt: snapshot.capturedAt || new Date().toISOString(),
      requestBody: snapshot.requestBody && typeof snapshot.requestBody === 'object' ? snapshot.requestBody : null,
      responseBody: snapshot.responseBody && typeof snapshot.responseBody === 'object' ? snapshot.responseBody : null,
    };
  }

  function apiSnapshotSpuId(snapshot) {
    return normalizeText(
      snapshot?.requestBody?.spu_id ||
      snapshot?.requestBody?.spuId ||
      snapshot?.responseBody?.result?.spu_id ||
      snapshot?.responseBody?.result?.spuId ||
      '',
    );
  }

  function latestApiSnapshot(endpoint, spuId) {
    const normalizedSpuId = normalizeText(spuId);
    return (
      (normalizedSpuId && complianceApiSnapshots.get(`${endpoint}:${normalizedSpuId}`)) ||
      complianceApiSnapshots.get(`${endpoint}:latest`) ||
      null
    );
  }

  function consumeExistingApiCaptures() {
    window.dispatchEvent(new Event(API_CAPTURE_REPLAY_EVENT));
  }

  function toFieldKey(label, fallback) {
    const known = COMPLIANCE_TITLES.find((item) => item.label === label);
    if (known) return known.key;
    const ascii = normalizeText(label)
      .replace(/[\uff1a:]/g, '')
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
      .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
    return ascii ? ascii.charAt(0).toLowerCase() + ascii.slice(1) : fallback;
  }

  function findEditDrawer() {
    const candidates = Array.from(
      document.querySelectorAll('.rocket-drawer-content-wrapper, .rocket-drawer-content, .rocket-drawer-wrapper-body, [role="dialog"]'),
    ).filter(isVisible);

    return candidates.find((element) => getText(element).includes(TEXT.editTitle)) || null;
  }

  function findDrawerFooter(drawer) {
    if (!drawer) return null;
    const directFooter = drawer.querySelector('.rocket-drawer-footer');
    if (directFooter && isVisible(directFooter)) return directFooter;

    const buttons = Array.from(drawer.querySelectorAll('button')).filter(isVisible);
    const footerButton = buttons.find((button) => {
      const text = getText(button).replace(/\s+/g, '');
      return text === '\u786e\u8ba4' || text === '\u53d6\u6d88';
    });

    if (!footerButton) return null;
    return footerButton.closest('.rocket-drawer-footer, [class*="footer"], [class*="Footer"]') || footerButton.parentElement;
  }

  function ensureButton() {
    const drawer = findEditDrawer();
    const currentButton = document.getElementById(BUTTON_ID);

    if (!drawer) {
      removeExistingButton();
      closeModal();
      return;
    }

    const footer = findDrawerFooter(drawer);
    if (!footer) {
      removeExistingButton();
      return;
    }

    if (currentButton?.dataset.version === SCRIPT_VERSION && footer.contains(currentButton)) return;
    removeExistingButton();

    const buttonSlot = document.createElement('span');
    buttonSlot.className = `${STYLE_SCOPE}__button-slot`;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.className = `${STYLE_SCOPE}__button`;
    button.dataset.version = SCRIPT_VERSION;
    button.textContent = TEXT.setTemplate;
    button.addEventListener('click', () => openSaveModal(drawer));

    buttonSlot.appendChild(button);
    footer.classList.add(`${STYLE_SCOPE}__footer-host`);
    footer.appendChild(buttonSlot);
  }

  function removeExistingButton() {
    const currentButton = document.getElementById(BUTTON_ID);
    const slot = currentButton?.closest(`.${STYLE_SCOPE}__button-slot`);
    if (slot) {
      slot.remove();
      return;
    }
    currentButton?.remove();
  }

  function closeModal() {
    document.querySelectorAll(`.${STYLE_SCOPE}__overlay`).forEach((node) => node.remove());
  }

  function createOverlay(drawer) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = `${STYLE_SCOPE}__overlay`;
    const host = drawer || findEditDrawer() || document.body;
    host.appendChild(overlay);
    return overlay;
  }

  function createModal(overlay, title, onClose) {
    const modal = document.createElement('div');
    modal.className = `${STYLE_SCOPE}__modal`;

    const header = document.createElement('div');
    header.className = `${STYLE_SCOPE}__modal-header`;
    header.textContent = title;

    const close = document.createElement('button');
    close.type = 'button';
    close.className = `${STYLE_SCOPE}__icon-button`;
    close.textContent = 'X';
    close.setAttribute('aria-label', TEXT.close);
    close.addEventListener('click', onClose || closeModal);
    header.appendChild(close);

    const body = document.createElement('div');
    body.className = `${STYLE_SCOPE}__modal-body`;

    modal.append(header, body);
    overlay.appendChild(modal);
    return { modal, body };
  }

  async function openSaveModal(drawer, draftName) {
    const overlay = createOverlay(drawer);
    const { body } = createModal(overlay, TEXT.modalTitle);
    const collected = collectPayload();
    const ownershipPromise = resolveOwnership(collected.ownership)
      .then((resolved) => {
        if (!resolved) return;
        Object.assign(collected.ownership, resolved);
        collected.companyId = collected.ownership.companyId;
        collected.shopId = collected.ownership.shopId;
        collected.templateInfoJson.ownership = collected.ownership;
      })
      .catch((error) => console.warn(`${LOG_PREFIX} ownership resolve failed`, error));

    const row = document.createElement('div');
    row.className = `${STYLE_SCOPE}__input-row`;

    const inputWrap = document.createElement('div');
    inputWrap.className = `${STYLE_SCOPE}__input-wrap`;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = `${STYLE_SCOPE}__input`;
    input.placeholder = TEXT.namePlaceholder;
    input.value = draftName || '';

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = `${STYLE_SCOPE}__clear`;
    clearButton.textContent = 'X';
    clearButton.addEventListener('click', () => {
      input.value = '';
      input.focus();
      setError('');
    });

    inputWrap.append(input, clearButton);

    const replaceButton = document.createElement('button');
    replaceButton.type = 'button';
    replaceButton.className = `${STYLE_SCOPE}__link ${STYLE_SCOPE}__replace`;
    replaceButton.textContent = TEXT.replace;
    replaceButton.hidden = true;

    row.append(inputWrap, replaceButton);

    const error = document.createElement('div');
    error.className = `${STYLE_SCOPE}__error`;

    const listButton = document.createElement('button');
    listButton.type = 'button';
    listButton.className = `${STYLE_SCOPE}__link`;
    listButton.textContent = TEXT.list;
    listButton.addEventListener('click', () => {
      const returnToSaveModal = () => openSaveModal(drawer, input.value);
      openTemplateList(drawer, collected.ownership, returnToSaveModal);
    });

    const actions = document.createElement('div');
    actions.className = `${STYLE_SCOPE}__actions`;

    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.className = `${STYLE_SCOPE}__primary`;
    confirm.textContent = TEXT.confirm;

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = `${STYLE_SCOPE}__secondary`;
    cancel.textContent = TEXT.cancel;
    cancel.addEventListener('click', closeModal);

    const getSku = document.createElement('button');
    getSku.type = 'button';
    getSku.className = `${STYLE_SCOPE}__secondary`;
    getSku.textContent = TEXT.getSku;
    getSku.disabled = !collected.product.spuId;

    actions.append(confirm, cancel, getSku);
    body.append(row, error, listButton, actions);

    let duplicateName = '';

    function setError(message) {
      error.textContent = message;
      if (!message) {
        replaceButton.hidden = true;
        duplicateName = '';
      }
    }

    async function submit(replace) {
      const name = normalizeText(input.value);
      if (!name) {
        setError(TEXT.nameRequired);
        return;
      }

      confirm.disabled = true;
      replaceButton.disabled = true;
      try {
        await ownershipPromise;
        const payload = { ...collected, name };
        const result = replace ? await replaceTemplate(payload) : await saveTemplate(payload);
        window.__TEMU_COMPLIANCE_TEMPLATE__ = payload.templateInfoJson;
        // console.group(LOG_PREFIX);
        // console.log(payload.templateInfoJson);
        // console.log(JSON.stringify(payload.templateInfoJson, null, 2));
        // console.log('Saved record:', result.data);
        // console.groupEnd();
        closeModal();
        showToast(replace ? TEXT.replaced : TEXT.saved);
      } catch (errorValue) {
        if (errorValue.status === 409) {
          duplicateName = name;
          error.textContent = TEXT.duplicate;
          replaceButton.hidden = false;
          return;
        }
        console.error(`${LOG_PREFIX} save failed`, errorValue);
        error.textContent = `${TEXT.saveFailed}: ${errorValue.message || TEXT.apiOffline}`;
        showToast(error.textContent, true);
      } finally {
        confirm.disabled = false;
        replaceButton.disabled = false;
      }
    }

    confirm.addEventListener('click', () => submit(false));
    getSku.addEventListener('click', async () => {
      const spuId = collected.product.spuId;
      if (!spuId) {
        setError(TEXT.noSpu);
        return;
      }

      const originalText = getSku.textContent;
      getSku.disabled = true;
      getSku.textContent = TEXT.gettingSku;
      setError('');

      try {
        const result = await lookupExtCodeBySpu(spuId);
        const extCode = normalizeText(result?.extCode);
        if (!extCode) throw new Error(TEXT.skuNotFound);
        input.value = extCode;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      } catch (errorValue) {
        console.error(`${LOG_PREFIX} get sku failed`, errorValue);
        setError(`${TEXT.getSkuFailed}: ${errorValue.message || TEXT.skuNotFound}`);
      } finally {
        getSku.disabled = false;
        getSku.textContent = originalText;
      }
    });
    replaceButton.addEventListener('click', () => {
      if (duplicateName) submit(true);
    });
    input.addEventListener('input', () => setError(''));
    input.focus();
  }

  async function openTemplateList(drawer, ownership, onClose, state) {
    const listState = {
      page: Math.max(1, state?.page || 1),
      pageSize: state?.pageSize || 10,
      search: normalizeText(state?.search || ''),
    };
    const overlay = createOverlay(drawer);
    const { body } = createModal(overlay, TEXT.listTitle, onClose || closeModal);
    body.textContent = '';

    const searchRow = document.createElement('div');
    searchRow.className = `${STYLE_SCOPE}__list-search`;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = `${STYLE_SCOPE}__input`;
    searchInput.placeholder = TEXT.searchPlaceholder;
    searchInput.value = listState.search;

    const searchButton = document.createElement('button');
    searchButton.type = 'button';
    searchButton.className = `${STYLE_SCOPE}__primary`;
    searchButton.textContent = TEXT.search;

    const clearSearchButton = document.createElement('button');
    clearSearchButton.type = 'button';
    clearSearchButton.className = `${STYLE_SCOPE}__secondary`;
    clearSearchButton.textContent = TEXT.clear;

    searchRow.append(searchInput, searchButton, clearSearchButton);
    body.appendChild(searchRow);

    const listHost = document.createElement('div');
    listHost.className = `${STYLE_SCOPE}__template-list`;
    body.appendChild(listHost);

    const pager = document.createElement('div');
    pager.className = `${STYLE_SCOPE}__pager`;

    const previousPage = document.createElement('button');
    previousPage.type = 'button';
    previousPage.className = `${STYLE_SCOPE}__secondary`;
    previousPage.textContent = TEXT.previousPage;

    const pageInfo = document.createElement('div');
    pageInfo.className = `${STYLE_SCOPE}__muted ${STYLE_SCOPE}__page-info`;

    const nextPage = document.createElement('button');
    nextPage.type = 'button';
    nextPage.className = `${STYLE_SCOPE}__secondary`;
    nextPage.textContent = TEXT.nextPage;

    pager.append(previousPage, pageInfo, nextPage);
    body.appendChild(pager);

    const status = document.createElement('div');
    status.className = `${STYLE_SCOPE}__muted`;
    status.textContent = 'Loading...';
    listHost.appendChild(status);

    function refresh(nextState) {
      openTemplateList(drawer, ownership, onClose, { ...listState, ...nextState });
    }

    searchButton.addEventListener('click', () => refresh({ page: 1, search: searchInput.value }));
    clearSearchButton.addEventListener('click', () => refresh({ page: 1, search: '' }));
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') refresh({ page: 1, search: searchInput.value });
    });

    try {
      const response = await listTemplates(ownership, listState);
      const rows = response.data || [];
      const pagination = response.pagination || {
        page: listState.page,
        pageSize: listState.pageSize,
        total: rows.length,
        totalPages: Math.max(1, Math.ceil(rows.length / listState.pageSize)),
      };
      listHost.textContent = '';
      if (!rows.length) {
        const empty = document.createElement('div');
        empty.className = `${STYLE_SCOPE}__muted`;
        empty.textContent = TEXT.emptyList;
        listHost.appendChild(empty);
      }

      rows.forEach((item) => {
        const row = document.createElement('div');
        row.className = `${STYLE_SCOPE}__template-row`;
        const name = document.createElement('span');
        name.className = `${STYLE_SCOPE}__template-name`;
        name.textContent = item.name;

        const view = document.createElement('button');
        view.type = 'button';
        view.className = `${STYLE_SCOPE}__link`;
        view.textContent = TEXT.viewJson;
        view.addEventListener('click', () => openJsonView(drawer, item, ownership, () => openTemplateList(drawer, ownership, onClose, listState)));

        const dryRun = document.createElement('button');
        dryRun.type = 'button';
        dryRun.className = `${STYLE_SCOPE}__link`;
        dryRun.textContent = TEXT.dryRun;
        dryRun.disabled = !item.usability?.applicable && !item.templateInfoJson?.interfaceSnapshot?.queryDetailCaptured;
        dryRun.title = dryRun.disabled ? TEXT.notApplicableTemplate : TEXT.dryRun;
        dryRun.addEventListener('click', () => openChangePreview(drawer, item, ownership, () => openTemplateList(drawer, ownership, onClose, listState)));

        const del = document.createElement('button');
        del.type = 'button';
        del.className = `${STYLE_SCOPE}__link ${STYLE_SCOPE}__danger-link`;
        del.textContent = TEXT.delete;
        del.addEventListener('click', async () => {
          try {
            await deleteTemplate(item.id);
            showToast(TEXT.deleted);
            refresh({ page: listState.page });
          } catch (errorValue) {
            console.error(`${LOG_PREFIX} delete failed`, errorValue);
            showToast(errorValue.message || TEXT.saveFailed, true);
          }
        });

        row.append(name, view, dryRun, del);
        listHost.appendChild(row);
      });

      pageInfo.textContent = TEXT.pageSummary
        .replace('{page}', String(pagination.page))
        .replace('{totalPages}', String(pagination.totalPages))
        .replace('{total}', String(pagination.total));
      previousPage.disabled = pagination.page <= 1;
      nextPage.disabled = pagination.page >= pagination.totalPages;
      previousPage.addEventListener('click', () => refresh({ page: pagination.page - 1 }));
      nextPage.addEventListener('click', () => refresh({ page: pagination.page + 1 }));
    } catch (errorValue) {
      console.error(`${LOG_PREFIX} list failed`, errorValue);
      status.textContent = errorValue.message || TEXT.apiOffline;
      status.classList.add(`${STYLE_SCOPE}__error`);
    }
  }

  function openJsonView(drawer, item, ownership, onClose) {
    const overlay = createOverlay(drawer);
    const { body } = createModal(overlay, item.name, onClose || closeModal);

    const pre = document.createElement('pre');
    pre.className = `${STYLE_SCOPE}__json`;
    pre.textContent = JSON.stringify(item.templateInfoJson, null, 2);

    const back = document.createElement('button');
    back.type = 'button';
    back.className = `${STYLE_SCOPE}__secondary`;
    back.textContent = TEXT.back;
    back.addEventListener('click', () => openTemplateList(drawer, ownership, onClose));

    body.append(pre, back);
  }

  async function openChangePreview(drawer, item, ownership, onClose) {
    const overlay = createOverlay(drawer);
    const { body } = createModal(overlay, TEXT.changePreviewTitle, onClose || closeModal);

    const status = document.createElement('div');
    status.className = `${STYLE_SCOPE}__muted`;
    status.textContent = 'Loading...';

    const reasonList = document.createElement('div');
    reasonList.className = `${STYLE_SCOPE}__reason-list`;

    const pre = document.createElement('pre');
    pre.className = `${STYLE_SCOPE}__json`;

    const actions = document.createElement('div');
    actions.className = `${STYLE_SCOPE}__actions`;

    const dryRunButton = document.createElement('button');
    dryRunButton.type = 'button';
    dryRunButton.className = `${STYLE_SCOPE}__primary`;
    dryRunButton.textContent = TEXT.dryRun;
    dryRunButton.disabled = true;

    const applyButton = document.createElement('button');
    applyButton.type = 'button';
    applyButton.className = `${STYLE_SCOPE}__secondary`;
    applyButton.textContent = TEXT.apply;
    applyButton.disabled = true;

    actions.append(dryRunButton, applyButton);
    body.append(status, reasonList, pre, actions);

    let preparedChange = null;
    let applyRequest = null;

    try {
      const current = collectPayload();
      const targetQueryDetailSnapshot = latestApiSnapshot('queryDetail', current.product.spuId);
      if (!targetQueryDetailSnapshot) throw new Error(TEXT.noQueryDetailSnapshot);

      const response = await prepareTemplateChange({
        templateId: item.id,
        targetQueryDetailSnapshot,
      });
      preparedChange = response.data;
      status.textContent = previewStatus(preparedChange);
      renderPreviewReasons(reasonList, preparedChange);
      pre.textContent = JSON.stringify(preparedChange, null, 2);
      dryRunButton.disabled = Boolean(preparedChange.missing?.length);
    } catch (errorValue) {
      console.error(`${LOG_PREFIX} prepare change failed`, errorValue);
      status.textContent = `${TEXT.prepareChangeFailed}: ${errorValue.message || TEXT.apiOffline}`;
      renderErrorReasons(reasonList, errorValue);
      status.classList.add(`${STYLE_SCOPE}__error`);
      return;
    }

    dryRunButton.addEventListener('click', async () => {
      dryRunButton.disabled = true;
      status.textContent = `${TEXT.dryRun}...`;
      try {
        const current = collectPayload();
        const targetQueryDetailSnapshot = latestApiSnapshot('queryDetail', current.product.spuId);
        const response = await dryRunTemplateChange({
          templateId: item.id,
          targetQueryDetailSnapshot,
          preparedChange,
          companyId: current.companyId,
          siteKey: current.siteKey,
          sourceOrigin: location.origin,
        });
        applyRequest = response.data?.applyRequest;
        pre.textContent = JSON.stringify(response.data, null, 2);
        status.textContent = TEXT.dryRunDone;
        applyButton.disabled = !applyRequest;
        showToast(TEXT.dryRunDone);
      } catch (errorValue) {
        console.error(`${LOG_PREFIX} dry run failed`, errorValue);
        status.textContent = `${TEXT.dryRunFailed}: ${errorValue.message || TEXT.apiOffline}`;
        renderErrorReasons(reasonList, errorValue);
        showToast(status.textContent, true);
      } finally {
        dryRunButton.disabled = false;
      }
    });

    applyButton.addEventListener('click', async () => {
      if (!applyRequest || !window.confirm(TEXT.applyConfirm)) return;
      applyButton.disabled = true;
      status.textContent = `${TEXT.apply}...`;
      try {
        const current = collectPayload();
        const response = await applyTemplateChange({
          templateId: item.id,
          applyRequest,
          confirmApply: true,
          companyId: current.companyId,
          siteKey: current.siteKey,
          sourceOrigin: location.origin,
        });
        pre.textContent = JSON.stringify(response.data, null, 2);
        status.textContent = TEXT.applyDone;
        showToast(TEXT.applyDone);
      } catch (errorValue) {
        console.error(`${LOG_PREFIX} apply failed`, errorValue);
        status.textContent = `${TEXT.applyFailed}: ${errorValue.message || TEXT.apiOffline}`;
        renderErrorReasons(reasonList, errorValue);
        showToast(status.textContent, true);
      } finally {
        applyButton.disabled = false;
      }
    });
  }

  function previewStatus(preparedChange) {
    const target = preparedChange?.target || {};
    const changed = (preparedChange?.diffSummary || []).filter((item) => item.changed).length;
    const missing = preparedChange?.missing?.length || 0;
    return `SPU ${target.spu_id || '-'} / goods ${target.goods_id || '-'}，变更任务 ${changed} 项，阻断原因 ${missing} 项`;
  }

  function renderPreviewReasons(host, preparedChange) {
    const missing = preparedChange?.missing || [];
    const changed = (preparedChange?.diffSummary || []).filter((item) => item.changed);
    if (missing.length) {
      renderReasons(host, '当前不能演练，原因：', missing.map(reasonText));
      return;
    }
    if (!changed.length) {
      renderReasons(host, '可以演练：未发现会改变任务内容的差异。', []);
      return;
    }
    renderReasons(host, '可以演练，将校验这些变更：', changed.map((item) =>
      `任务 ${item.task_type}${item.task_id ? ` / task_id ${item.task_id}` : ''} 将使用${item.source === 'template' ? '模板内容' : '当前商品内容'}`,
    ));
  }

  function renderErrorReasons(host, errorValue) {
    const details = errorValue?.payload?.details || errorValue?.details || {};
    const missing = Array.isArray(details.missing) ? details.missing : [];
    if (missing.length) {
      renderReasons(host, '当前不能继续，原因：', missing.map(reasonText));
      return;
    }
    const message = errorValue?.message || errorValue?.payload?.error || TEXT.apiOffline;
    renderReasons(host, '当前不能继续，原因：', [message]);
  }

  function renderReasons(host, title, reasons) {
    host.textContent = '';
    const titleNode = document.createElement('div');
    titleNode.className = `${STYLE_SCOPE}__reason-title`;
    titleNode.textContent = title;
    host.appendChild(titleNode);
    if (!reasons.length) return;
    const list = document.createElement('ul');
    reasons.forEach((reason) => {
      const item = document.createElement('li');
      item.textContent = reason;
      list.appendChild(item);
    });
    host.appendChild(list);
  }

  function reasonText(reason) {
    const map = {
      goods_id: '缺少 goods_id：需要重新打开当前商品编辑抽屉并捕获 query_detail。',
      spu_id: '缺少 spu_id：需要重新打开当前商品编辑抽屉并捕获 query_detail。',
      cat_id: '缺少 cat_id：Temu 校验接口需要类目 ID，当前 query_detail 快照没有提供。',
      template_edit_request_list: '缺少 template_edit_request_list：模板没有可应用的合规任务草稿。',
      displayed_task_type_list: '缺少 displayed_task_type_list：当前商品没有捕获到待展示任务列表。',
      'interfaceSnapshot.queryDetailCaptured': '模板缺少 query_detail 快照：请从编辑抽屉重新保存一次模板。',
      'submissionDraft.template_edit_request_list': '模板缺少提交草稿：请从编辑抽屉重新保存一次模板。',
    };
    return map[reason] || String(reason);
  }

  function showToast(message, danger) {
    document.querySelectorAll(`.${STYLE_SCOPE}__toast`).forEach((node) => node.remove());
    const toast = document.createElement('div');
    toast.className = `${STYLE_SCOPE}__toast${danger ? ` ${STYLE_SCOPE}__toast--danger` : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1000);
  }

  function collectPayload() {
    const drawer = findEditDrawer();
    if (!drawer) throw new Error(TEXT.editTitle);
    const product = collectProduct(drawer);
    const ownership = collectOwnership(product);
    const templateInfoJson = collectTemplateInfo(drawer, product, ownership);

    return {
      companyId: ownership.companyId,
      shopId: ownership.shopId,
      platform: ownership.platform,
      siteKey: ownership.siteKey,
      spuId: product.spuId,
      productTitle: product.productTitle,
      category: product.category,
      sourceUrl: location.href,
      ownership,
      product,
      templateInfoJson,
    };
  }

  function collectProduct(drawer) {
    const text = getText(drawer);
    const title = Array.from(drawer.querySelectorAll('*'))
      .map(getText)
      .filter((item) => item.includes('JIT') && item.length < 500)
      .sort((a, b) => a.length - b.length)[0] || '';

    return {
      spuId: (text.match(/SPU[\uff1a:]\s*([0-9]+)/i) || [])[1] || '',
      productTitle: title,
      category: (text.match(/\u7c7b\u76ee[\uff1a:]\s*([^\s]+)/) || [])[1] || '',
      sourceUrl: location.href,
    };
  }

  function collectOwnership(product) {
    const host = location.hostname;
    const localValues = scanStorageForOwnership();
    const visibleShopName = getVisibleShopName();
    const companyId = firstValidId(localValues.companyId, localValues.company_id, localValues.teamId, localValues.team_id) || UNKNOWN_COMPANY_ID;
    const shopId = firstValidId(localValues.shopId, localValues.shop_id, localValues.mallId, localValues.mall_id, localValues.storeId, localValues.store_id) || UNKNOWN_SHOP_ID;

    return {
      companyId,
      shopId,
      platform: 'TEMU',
      siteKey: host || 'agentseller.temu.com',
      shopName: visibleShopName || '',
    };
  }

  function scanStorageForOwnership() {
    const result = {};
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        const value = localStorage.getItem(key);
        if (!key || !value || value.length > 20000) continue;
        const lower = key.toLowerCase();
        collectOwnershipValue(result, lower, value);
        if (value.startsWith('{') || value.startsWith('[')) {
          collectOwnershipFromJson(result, value);
        }
      }
    } catch (error) {
      console.warn(`${LOG_PREFIX} localStorage scan failed`, error);
    }
    return result;
  }

  function collectOwnershipFromJson(result, value) {
    try {
      const parsed = JSON.parse(value);
      walkOwnershipObject(result, parsed);
    } catch (error) {
      // Ignore storage values that only look like JSON.
    }
  }

  function walkOwnershipObject(result, value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.slice(0, 20).forEach((item) => walkOwnershipObject(result, item));
      return;
    }

    Object.entries(value).forEach(([key, item]) => {
      const lower = String(key).toLowerCase();
      if (typeof item === 'string' || typeof item === 'number') {
        collectOwnershipValue(result, lower, String(item));
      } else if (item && typeof item === 'object') {
        walkOwnershipObject(result, item);
      }
    });
  }

  function collectOwnershipValue(result, lowerKey, value) {
    const normalized = normalizeText(value);
    if (!normalized) return;
    if (!result.companyId && (lowerKey === 'companyid' || lowerKey === 'company_id' || lowerKey === 'teamid' || lowerKey === 'team_id')) {
      result.companyId = normalized;
    }
    if (!result.shopId && (lowerKey === 'shopid' || lowerKey === 'shop_id' || lowerKey === 'storeid' || lowerKey === 'store_id')) {
      result.shopId = normalized;
    }
    if (!result.mallId && (lowerKey === 'mallid' || lowerKey === 'mall_id')) {
      result.mallId = normalized;
    }
  }

  function firstValidId(...values) {
    return values.map((value) => normalizeText(value)).find(isLikelyInternalId) || '';
  }

  function isLikelyInternalId(value) {
    return /^c[a-z0-9]{20,}$/i.test(value) || /^[0-9]{12,}$/.test(value);
  }

  function getVisibleShopName() {
    const texts = Array.from(document.body.querySelectorAll('*'))
      .filter(isVisible)
      .map((node) => normalizeText(node.innerText || node.textContent || ''))
      .filter((text) => text.length >= 3 && text.length <= 80);
    return texts.find((text) =>
      /^[A-Z][A-Z0-9_-]{2,}$/.test(text) &&
      !text.includes('SPU') &&
      !text.startsWith('JIT') &&
      !text.includes('\u3010') &&
      !/TEMU|SUCCESS|COURIER/.test(text)
    ) || '';
  }

  async function resolveOwnership(ownership) {
    if (ownership.companyId !== UNKNOWN_COMPANY_ID && ownership.shopId !== UNKNOWN_SHOP_ID) return ownership;
    if (!ownership.shopName && ownership.shopId === UNKNOWN_SHOP_ID) return ownership;
    const params = new URLSearchParams({
      platform: ownership.platform,
      siteKey: ownership.siteKey,
    });
    if (ownership.shopName) params.set('shopName', ownership.shopName);
    if (ownership.shopId !== UNKNOWN_SHOP_ID) params.set('shopId', ownership.shopId);
    const response = await requestJson(`/api/compliance-info-templates/ownership?${params.toString()}`, { method: 'GET' });
    return response.data || ownership;
  }

  function collectTemplateInfo(drawer, product, ownership) {
    const sections = findSections(drawer).map((section, sectionIndex) =>
      collectSection(section, sectionIndex),
    );
    const queryDetailSnapshot = latestApiSnapshot('queryDetail', product.spuId);
    const interfaceSnapshot = buildInterfaceSnapshot(queryDetailSnapshot);

    return {
      kind: 'complianceInfoTemplate',
      version: 1,
      sourceUrl: location.href,
      collectedAt: new Date().toISOString(),
      product,
      ownership,
      sections,
      interfaceSnapshot,
      submissionDraft: buildSubmissionDraft(interfaceSnapshot),
      usability: buildTemplateUsability(interfaceSnapshot),
    };
  }

  function buildInterfaceSnapshot(queryDetailSnapshot) {
    if (!queryDetailSnapshot) {
      return {
        queryDetailCaptured: false,
      };
    }

    const request = queryDetailSnapshot.requestBody || {};
    const result = queryDetailSnapshot.responseBody?.result || {};
    return {
      queryDetailCaptured: true,
      capturedAt: queryDetailSnapshot.capturedAt,
      status: queryDetailSnapshot.status,
      request: {
        goods_id: request.goods_id ?? null,
        spu_id: request.spu_id ?? null,
        wait_task_list: cloneJson(request.wait_task_list || []),
      },
      result: {
        goods_id: result.goods_id ?? request.goods_id ?? null,
        spu_id: result.spu_id ?? request.spu_id ?? null,
        cat_id: result.cat_id ?? result.leaf_cat_id ?? null,
        group_sku_by_same_info: result.group_sku_by_same_info ?? null,
        sku_info_list: cloneJson(result.sku_info_list || []),
        template_list: cloneJson(result.template_list || []),
      },
    };
  }

  function buildSubmissionDraft(interfaceSnapshot) {
    if (!interfaceSnapshot?.queryDetailCaptured) return null;

    const waitTaskList = interfaceSnapshot.request?.wait_task_list || [];
    const templateList = interfaceSnapshot.result?.template_list || [];
    const waitTaskByType = new Map(waitTaskList.map((task) => [String(task.task_type), task]));
    const templateEditRequestList = templateList.map((template) =>
      buildTemplateEditRequest(template, waitTaskByType.get(String(template.task_type))),
    ).filter(Boolean);

    return {
      source: 'query_detail',
      readyForDirectSubmit: false,
      goods_id: interfaceSnapshot.result.goods_id,
      spu_id: interfaceSnapshot.result.spu_id,
      cat_id: interfaceSnapshot.result.cat_id,
      group_sku_by_same_info: interfaceSnapshot.result.group_sku_by_same_info,
      displayed_task_type_list: waitTaskList.map((task) => task.task_type).filter((taskType) => taskType !== undefined && taskType !== null),
      simple_template_list: templateList
        .filter((template) => template.template_id)
        .map((template) => ({
          template_id: template.template_id,
          task_type: template.task_type,
          task_status: template.task_status,
        })),
      template_edit_request_list: templateEditRequestList,
    };
  }

  function buildTemplateEditRequest(template, waitTask) {
    if (!template || typeof template !== 'object') return null;

    const request = {};
    copyDefined(request, 'task_id', waitTask?.task_id ?? template.task_id);
    copyDefined(request, 'task_type', template.task_type ?? waitTask?.task_type);
    copyDefined(request, 'task_name', waitTask?.task_name ?? template.task_name);
    copyDefined(request, 'is_not_required', waitTask?.is_not_required ?? template.is_not_required);
    copyDefined(request, 'status', waitTask?.status ?? template.status);
    copyDefined(request, 'task_status', template.task_status ?? waitTask?.task_status);
    copyDefined(request, 'template_id', template.template_id);

    if (template.properties) request.properties = cloneJson(template.properties);
    if (template.images) request.images = cloneJson(template.images);
    else if (template.template_id) request.images = {};
    if (template.input_text) request.input_text = cloneJson(template.input_text);
    else if (template.template_id) request.input_text = {};
    if (template.suppl_prop_info_list) request.suppl_prop_info_list = cloneJson(template.suppl_prop_info_list);

    const selectedReps = selectedRepDetailList(template.rep_detail_list);
    if (selectedReps.length) request.rep_detail_list = selectedReps;
    if (template.reject_reason_list) request.reject_reason_list = cloneJson(template.reject_reason_list);

    return request;
  }

  function selectedRepDetailList(repDetailList) {
    if (!Array.isArray(repDetailList)) return [];
    const selected = repDetailList.filter((rep) => rep?.default_select);
    return selected.map((rep) => {
      const result = {};
      copyDefined(result, 'rep_type', rep.rep_type);
      copyDefined(result, 'rep_id', rep.rep_id);
      copyDefined(result, 'rep_name', rep.rep_name);
      return result;
    });
  }

  function buildTemplateUsability(interfaceSnapshot) {
    if (!interfaceSnapshot?.queryDetailCaptured) {
      return {
        canBuildSubmitDraft: false,
        directSubmitReady: false,
        missing: ['query_detail snapshot'],
      };
    }

    const missing = [];
    if (!interfaceSnapshot.result?.goods_id) missing.push('goods_id');
    if (!interfaceSnapshot.result?.spu_id) missing.push('spu_id');
    if (!interfaceSnapshot.result?.template_list?.length) missing.push('template_list');
    if (!interfaceSnapshot.request?.wait_task_list?.length) missing.push('wait_task_list');
    if (!interfaceSnapshot.result?.cat_id) missing.push('cat_id');

    return {
      canBuildSubmitDraft: missing.length === 0 || !missing.includes('template_list'),
      directSubmitReady: false,
      missing,
      note: 'submissionDraft is a query_detail-derived draft; run query_dynamic_template and check_edit_compliance before edit_compliance.',
    };
  }

  function copyDefined(target, key, value) {
    if (value !== undefined && value !== null) target[key] = value;
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value ?? null));
  }

  function findSections(drawer) {
    const nodes = Array.from(drawer.querySelectorAll('*')).filter(isVisible);
    return COMPLIANCE_TITLES.map((title) => {
      const exact = nodes.find((node) => getText(node) === title.label);
      const direct = nodes
        .filter((node) => {
          const text = getText(node);
          return text.startsWith(title.label) && !COMPLIANCE_TITLES.some((other) => other.label !== title.label && text.includes(other.label));
        })
        .sort((a, b) => getText(b).length - getText(a).length)[0];

      let element = direct || exact;
      if (exact && !direct) {
        while (element.parentElement && element.parentElement !== drawer) {
          const parentText = getText(element.parentElement);
          if (!parentText.startsWith(title.label)) break;
          if (COMPLIANCE_TITLES.some((other) => other.label !== title.label && parentText.includes(other.label))) break;
          element = element.parentElement;
        }
      }

      return element ? { ...title, element } : null;
    }).filter(Boolean);
  }

  function collectSection(section, sectionIndex) {
    const text = getText(section.element);
    const fields = collectFields(section, sectionIndex);
    const status = (text.match(/(\u4e0a\u4f20\u6210\u529f|\u5f85\u4e0a\u4f20|\u5ba1\u6838\u4e2d|\u5ba1\u6838\u5931\u8d25|\u5df2\u586b\u5199|\u672a\u586b\u5199|\u65e0\u9700\u586b\u5199)/) || [])[1] || '';

    return {
      sectionKey: section.key,
      sectionLabel: section.label,
      status,
      filled: status === '\u4e0a\u4f20\u6210\u529f' || status === '\u5df2\u586b\u5199' || text.includes('\u8be5\u5c5e\u6027\u5df2\u586b\u5199'),
      fields,
    };
  }

  function collectFields(section, sectionIndex) {
    const rows = Array.from(section.element.querySelectorAll('.rocket-form-field-item')).filter(isVisible);
    const fields = rows.map((row, rowIndex) => collectFieldFromRow(row, section, sectionIndex, rowIndex)).filter(Boolean);
    if (fields.length) return fields;

    return Array.from(section.element.querySelectorAll('input, textarea, select, [role="combobox"], [role="checkbox"]'))
      .filter((control) => control.matches('[role="combobox"]') || isVisible(control))
      .map((control, controlIndex) => collectFieldFromControl(control, section, sectionIndex, controlIndex))
      .filter(Boolean);
  }

  function collectFieldFromRow(row, section, sectionIndex, rowIndex) {
    const labelNode = row.querySelector('.rocket-form-field-item-label label, label, .rocket-form-field-item-label');
    const label = normalizeText(labelNode?.innerText || labelNode?.textContent || '');
    if (!label) return null;

    const valueNode =
      row.querySelector('.rocket-select-selection-item') ||
      row.querySelector('.rocket-select-selection-placeholder') ||
      row.querySelector('.rocket-checkbox-wrapper-checked') ||
      row.querySelector('.rocket-form-field-item-control-input-content') ||
      row.querySelector('.rocket-form-field-item-control');

    return {
      sectionKey: section.key,
      sectionLabel: section.label,
      fieldKey: toFieldKey(label, `${section.key}Field${rowIndex + 1}`),
      label,
      type: detectRowType(row),
      value: normalizeText(valueNode?.innerText || valueNode?.textContent || ''),
      required: Boolean(row.querySelector('.rocket-form-field-item-required, [required], [aria-required="true"]')),
      domPath: buildDomPath(row, sectionIndex, rowIndex),
    };
  }

  function collectFieldFromControl(control, section, sectionIndex, controlIndex) {
    const label = findControlLabel(control) || `${section.label}${controlIndex + 1}`;
    return {
      sectionKey: section.key,
      sectionLabel: section.label,
      fieldKey: toFieldKey(label, `${section.key}Field${controlIndex + 1}`),
      label,
      type: control.getAttribute('role') || control.getAttribute('type') || control.tagName.toLowerCase(),
      value: readControlValue(control),
      required: Boolean(control.required || control.getAttribute('aria-required') === 'true'),
      domPath: buildDomPath(control, sectionIndex, controlIndex),
    };
  }

  function detectRowType(row) {
    if (row.querySelector('.rocket-select')) return 'select';
    if (row.querySelector('.rocket-checkbox, input[type="checkbox"]')) return 'checkbox';
    if (row.querySelector('textarea')) return 'textarea';
    const input = row.querySelector('input');
    if (input) return input.getAttribute('type') || 'input';
    if (row.querySelector('table')) return 'table';
    return 'display';
  }

  function findControlLabel(control) {
    const formItem = control.closest('.rocket-form-field-item');
    const label = formItem?.querySelector('.rocket-form-field-item-label label, label, .rocket-form-field-item-label');
    return normalizeText(label?.innerText || label?.textContent || control.getAttribute('aria-label') || '');
  }

  function readControlValue(control) {
    if (control.matches('input[type="checkbox"], input[type="radio"]')) return control.checked;
    const select = control.closest('.rocket-select');
    if (select) {
      const item = select.querySelector('.rocket-select-selection-item, .rocket-select-selection-placeholder');
      return normalizeText(item?.innerText || item?.textContent || '');
    }
    return normalizeText(control.value || control.innerText || control.textContent || '');
  }

  function buildDomPath(element, sectionIndex, itemIndex) {
    const selector =
      element.matches('.rocket-form-field-item')
        ? '.rocket-form-field-item'
        : element.matches('input, textarea, select')
          ? element.tagName.toLowerCase()
          : element.getAttribute('role')
            ? `[role="${element.getAttribute('role')}"]`
            : element.tagName.toLowerCase();

    return {
      selector,
      sectionIndex,
      itemIndex,
      textHint: normalizeText(element.innerText || element.textContent || '').slice(0, 80),
    };
  }

  async function requestJson(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  function saveTemplate(payload) {
    return requestJson('/api/compliance-info-templates', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  function replaceTemplate(payload) {
    return requestJson('/api/compliance-info-templates/replace', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  function listTemplates(ownership, options) {
    const params = new URLSearchParams({
      companyId: ownership.companyId,
      siteKey: ownership.siteKey,
      page: String(options?.page || 1),
      pageSize: String(options?.pageSize || 10),
    });
    if (options?.search) params.set('search', normalizeText(options.search));
    return requestJson(`/api/compliance-info-templates?${params.toString()}`, { method: 'GET' });
  }

  function deleteTemplate(id) {
    return requestJson(`/api/compliance-info-templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  function prepareTemplateChange(payload) {
    return requestJson('/api/compliance-info-templates/prepare-change', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  function dryRunTemplateChange(payload) {
    return requestJson('/api/compliance-info-templates/dry-run-change', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  function applyTemplateChange(payload) {
    return requestJson('/api/compliance-info-templates/apply-change', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  function lookupExtCodeBySpu(spuId) {
    return requestJson('/api/temu/product-ext-code', {
      method: 'POST',
      body: JSON.stringify({
        spuId,
        companyId: collectedCompanyId(),
        siteKey: location.hostname || 'agentseller.temu.com',
        sourceOrigin: location.origin,
      }),
    }).then((response) => response.data);
  }

  function collectedCompanyId() {
    const ownership = scanStorageForOwnership();
    return firstValidId(ownership.companyId, ownership.company_id, ownership.teamId, ownership.team_id) || '';
  }

  window.addEventListener('message', handleApiCapture);
  consumeExistingApiCaptures();
  ensureButton();
  const observer = new MutationObserver(ensureButton);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
