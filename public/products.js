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

fetchProducts();
