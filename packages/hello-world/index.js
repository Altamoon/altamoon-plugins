/* eslint-disable @typescript-eslint/no-unsafe-member-access, no-undef, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-assignment */// eslint-disable-line max-len
(() => {
  const layout = `
    <div class="row">
        <div class="col-12 mb-1">
            <label for="hello_world_qty" class="form-label">Quantity</label>
            <input id="hello_world_qty" type="text" placeholder="Quantity" class="form-control" value="0">
        </div>
        <div class="col-6 d-grid">
            <button disabled id="hello_world_buy" type="button" class="btn btn-success mt-3 btn-block" disabled="">Buy</button>
        </div>
        <div class="col-6 d-grid">
            <button disabled id="hello_world_sell" type="button" class="btn btn-sell mt-3 btn-block" disabled="">Sell</button>
        </div>
    </div>
  `;

  const settingsLayout = `
    <label for="hello_world_btn_size" class="form-label">Button Size</label>
    <select class="form-control" id="hello_world_btn_size">
        <option value="sm">Small</option>
        <option value="" selected>Normal</option>
        <option value="lg">Large</option>
    </select>
  `;

  window.altamoonPlugin((store) => {
    const {
      element, settingsElement, listenSettingsSave, listenSettingsCancel,
    } = store.customization.createWidget({
      id: 'hello_world',
      hasSettings: true,
      title: 'Hello World',
      currentScript: document.currentScript,
      layout: { minH: 10 },
    });

    let buttonSize = localStorage.helloWorldButtonSize || '';

    const createOrder = async (side, quantity) => {
      await store.trading.marketOrder({
        quantity, side, symbol: store.persistent.symbol,
      });
    };

    element.innerHTML = layout;
    settingsElement.innerHTML = settingsLayout;

    const quantityElement = element.querySelector('#hello_world_qty');
    const buyButtonElement = element.querySelector('#hello_world_buy');
    const sellButtonElement = element.querySelector('#hello_world_sell');
    const buttonSizeSettingElement = settingsElement.querySelector('#hello_world_btn_size');
    const setSize = (size) => {
      buyButtonElement.classList.toggle('btn-sm', size === 'sm');
      buyButtonElement.classList.toggle('btn-lg', size === 'lg');
      sellButtonElement.classList.toggle('btn-sm', size === 'sm');
      sellButtonElement.classList.toggle('btn-lg', size === 'lg');
    };

    if (buttonSize) {
      setSize(buttonSize);
    }

    listenSettingsSave(() => {
      localStorage.helloWorldButtonSize = buttonSize;
      setSize(buttonSize);
    });

    listenSettingsCancel(() => {
      buttonSize = localStorage.helloWorldButtonSize || '';
      buttonSizeSettingElement.value = buttonSize;
    });

    buttonSizeSettingElement.addEventListener('change', ({ target }) => {
      buttonSize = target.value;
    });

    quantityElement.addEventListener('input', ({ target }) => {
      const qty = +target.value || 0;
      buyButtonElement.disabled = !qty;
      sellButtonElement.disabled = !qty;
    });

    buyButtonElement.addEventListener('click', () => {
      const qty = +quantityElement.value || 0;
      createOrder('BUY', qty);
    });

    sellButtonElement.addEventListener('click', () => {
      const qty = +quantityElement.value || 0;
      createOrder('SELL', qty);
    });
  });
})();
