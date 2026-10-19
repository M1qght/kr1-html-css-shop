// Добавляет aria-invalid полям, которые не прошли HTML-валидацию.
function markInvalidFields(form) {
  const fields = Array.from(form.elements).filter((element) => element.willValidate);

  fields.forEach((field) => {
    field.toggleAttribute('aria-invalid', !field.checkValidity());
  });
}

// Убирает подсветку ошибки после изменения поля.
function clearInvalidState(event) {
  if (event.target.matches('input, select, textarea')) {
    event.target.removeAttribute('aria-invalid');
  }
}

// Быстрый заказ на главной странице.
const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const selectedProductInput = document.getElementById('selected-product');
const successMessage = document.getElementById('success-message');

if (orderDialog && orderForm && selectedProductInput) {
  const closeButtons = [
    document.getElementById('close-order-dialog'),
    document.getElementById('cancel-order-dialog')
  ].filter(Boolean);

  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;

      selectedProductInput.value = productName;
      document.getElementById('order-dialog-title').textContent = `Заказать ${productName}`;
      orderDialog.showModal();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      orderDialog.close();
    });
  });

  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });

  orderForm.addEventListener('input', clearInvalidState);

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    markInvalidFields(orderForm);

    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    orderDialog.close();
    orderForm.reset();
    successMessage.hidden = false;

    window.setTimeout(() => {
      successMessage.hidden = true;
    }, 5000);
  });
}

// Отдельная форма на странице order.html.
const checkoutForm = document.getElementById('checkout-form');

if (checkoutForm) {
  const productSelect = document.getElementById('checkout-product');
  const requestedProduct = new URLSearchParams(window.location.search).get('product');

  const productExists = Array.from(productSelect.options).some((option) => {
    return option.value === requestedProduct;
  });

  if (requestedProduct && productExists) {
    productSelect.value = requestedProduct;
  }

  checkoutForm.addEventListener('input', clearInvalidState);

  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    markInvalidFields(checkoutForm);

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const successBlock = document.getElementById('checkout-success');

    checkoutForm.hidden = true;
    successBlock.hidden = false;
    successBlock.focus();
  });
}
