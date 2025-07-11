async function fetchProducts() {
  const res = await fetch('/products');
  const products = await res.json();
  const ul = document.getElementById('product-list');

  products.forEach(p => {
    const li = document.createElement('li');
    li.classList.add('product-item');
    const img = document.createElement('img');
    img.src = `img/${p.name}.png`; // Cambia según tu convención de nombres

    img.alt = p.name;
    img.style.width = '180px';

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
        console.log('Producto agregado al carrito');
        await fetchCartProducts();
      } else {
        console.error('Error al agregar producto al carrito');
      }
    };
  li.appendChild(img);
    li.appendChild(info);
    li.appendChild(button);
    ul.appendChild(li);
  });
}

async function fetchCartProducts() {

  const res = await fetch('/cart');
  const products = await res.json();
  const ul = document.getElementById('cartProducts');

   ul.innerHTML = "";

  products.forEach(p => {
    
    const li = document.createElement('li'); 
    const info = document.createElement('div'); 
    const buttonDelete = document.createElement('button'); 
    const img = document.createElement('img');
    img.style.width = '100px';
    img.style.height = '100px';
  
    img.src = `img/${p.product_name}.png`; // Cambia según tu convención de nombres
    img.alt = p.product_name;
    buttonDelete.textContent = 'Delete';  
    buttonDelete.classList.add('delete-button');
    buttonDelete.dataset.id = p.id;     
    info.textContent = `Product: ${p.product_name} - Quantity: ${p.quantity} - Price: ${p.price}`;

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(buttonDelete);
    ul.appendChild(li);
  });

const payTotal = document.createElement('p');
payTotal.id = 'payTotal';
   payTotal.textContent = 'Total: $' + products.reduce
   ((total, item) => total + (item.price * item.quantity), 0);
   ul.appendChild(payTotal);

   deleteElementToCart();

}

function toggleCart() {
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

function deleteElementToCart() {
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.onclick = async (e) => {

      try {
        const li = e.target.parentElement; 
        const id = li.querySelector('.delete-button').dataset.id; // Assuming you set data-id on the button
        const res = await fetch(`/cart/${id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          li.remove();
          console.log('Producto eliminado del carrito');
          await fetchCartProducts(); 
        } else {
          console.error('Error al eliminar producto del carrito');
        }
      } catch (error) {
        console.error('Error al intentar eliminar el producto del carrito:', error);
        alert('Ocurrió un error inesperado');
      }
    };
  });
}




fetchProducts();
fetchCartProducts();
toggleCart();

