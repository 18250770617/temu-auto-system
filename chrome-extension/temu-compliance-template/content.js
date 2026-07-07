(function () {
  const API_BASE_URL = 'http://127.0.0.1:8787';
  const BUTTON_ID = 'temu-compliance-template-button';
  const STYLE_SCOPE = 'temu-compliance-template';
  const LOG_PREFIX = '[TemuComplianceTemplate]';
  const SCRIPT_VERSION = '0.2.0';
  const UNKNOWN_COMPANY_ID = 'unknown-company';
  const UNKNOWN_SHOP_ID = 'unknown-shop';

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
    close: '\u5173\u95ed',
    back: '\u8fd4\u56de',
    deleted: '\u6a21\u677f\u5df2\u5220\u9664',
    apiOffline: '\u672c\u5730 API \u672a\u8fde\u63a5\uff0c\u8bf7\u5148\u542f\u52a8 npm run dev:api',
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
    getSku.disabled = true;

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
    replaceButton.addEventListener('click', () => {
      if (duplicateName) submit(true);
    });
    input.addEventListener('input', () => setError(''));
    input.focus();
  }

  async function openTemplateList(drawer, ownership, onClose) {
    const overlay = createOverlay(drawer);
    const { body } = createModal(overlay, TEXT.listTitle, onClose || closeModal);
    body.textContent = '';

    const status = document.createElement('div');
    status.className = `${STYLE_SCOPE}__muted`;
    status.textContent = 'Loading...';
    body.appendChild(status);

    try {
      const response = await listTemplates(ownership);
      const rows = response.data || [];
      body.textContent = '';
      if (!rows.length) {
        const empty = document.createElement('div');
        empty.className = `${STYLE_SCOPE}__muted`;
        empty.textContent = TEXT.emptyList;
        body.appendChild(empty);
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
        view.addEventListener('click', () => openJsonView(drawer, item, ownership, () => openTemplateList(drawer, ownership, onClose)));

        const del = document.createElement('button');
        del.type = 'button';
        del.className = `${STYLE_SCOPE}__link ${STYLE_SCOPE}__danger-link`;
        del.textContent = TEXT.delete;
        del.addEventListener('click', async () => {
          try {
            await deleteTemplate(item.id);
            showToast(TEXT.deleted);
            openTemplateList(drawer, ownership, onClose);
          } catch (errorValue) {
            console.error(`${LOG_PREFIX} delete failed`, errorValue);
            showToast(errorValue.message || TEXT.saveFailed, true);
          }
        });

        row.append(name, view, del);
        body.appendChild(row);
      });
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

    return {
      kind: 'complianceInfoTemplate',
      version: 1,
      sourceUrl: location.href,
      collectedAt: new Date().toISOString(),
      product,
      ownership,
      sections,
    };
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

  function listTemplates(ownership) {
    const params = new URLSearchParams({
      companyId: ownership.companyId,
      shopId: ownership.shopId,
      siteKey: ownership.siteKey,
    });
    return requestJson(`/api/compliance-info-templates?${params.toString()}`, { method: 'GET' });
  }

  function deleteTemplate(id) {
    return requestJson(`/api/compliance-info-templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  ensureButton();
  const observer = new MutationObserver(ensureButton);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
