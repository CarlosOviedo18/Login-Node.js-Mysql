async function fetchCartProducts() {
  const res = await fetch('/cart');
  const products = await res.json();
  const ul = document.getElementById('cartProducts');

  products.forEach(p => {
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.textContent = `Id: ${p.cart_id} - Product: ${p.product_id} - Quantity: ${p.quantity} - Price: ${p.price}`;
    li.appendChild(info);
    ul.appendChild(li);
  });
}

fetchCartProducts();