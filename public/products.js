async function fetchProducts() {
  const res = await fetch('/products');
  const products = await res.json();
  const ul = document.getElementById('product-list');

  products.forEach(p => {
    const li = document.createElement('li');
    li.classList.add('product-item');

    const info = document.createElement('div');
    info.textContent = `${p.name} - $${p.price} - Stock: ${p.stock}`;

    const button = document.createElement('button');
    button.textContent = 'Add to Cart';

    button.onclick = async () => {

      const userId = p.id; 
      const quantity = 1; 
      const price = p.price;
      const productId = p.id;

      const res = await fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity, price })
      });

      if (res.ok) {
        alert('Producto agregado al carrito');
      } else {
        alert('Error al agregar producto al carrito');
      }
    };

    li.appendChild(info);
    li.appendChild(button);
    ul.appendChild(li);
  });
}

async function fetchCartProducts() {

  const res = await fetch('/cart');
  const products = await res.json();
  const ul = document.getElementById('cartProducts');
  products.forEach(p => {
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.textContent = `Product: ${p.product_name} - Quantity: ${p.quantity} - Price: ${p.price}`;
    li.appendChild(info);
    ul.appendChild(li);
  });


document.getElementById('open-cart').onclick = function(e) {
  e.preventDefault();
  document.getElementById('cart-modal').classList.add('open');
};
document.getElementById('close-cart').onclick = function() {
  document.getElementById('cart-modal').classList.remove('open');
};

document.getElementById('cart-modal').onclick = function(e) {
  if (e.target === this) {
    this.classList.remove('open');
  }
};
}


fetchCartProducts();
fetchProducts();
