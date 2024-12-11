interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

let carrito: ItemCarrito[] = [];

// Cargar carrito desde localStorage
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  actualizarCarritoUI();
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function agregarAlCarrito(producto: Producto): void {
  const itemEnCarrito = carrito.find((item) => item.id === producto.id);
  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarritoUI();
}

export function vaciarCarrito(): void {
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
}

export function actualizarCarritoUI(): void {
  const contador = document.getElementById(
    "carrito-contador"
  ) as HTMLSpanElement;
  const itemsList = document.getElementById(
    "carrito-items"
  ) as HTMLUListElement;
  const total = document.getElementById("carrito-total") as HTMLSpanElement;

  if (contador)
    contador.textContent = carrito
      .reduce((sum, item) => sum + item.cantidad, 0)
      .toString();

  if (itemsList) {
    itemsList.innerHTML = "";
    carrito.forEach((item) => {
      const li = document.createElement("li");
      li.className = "border-b border-gray-300 py-2 flex items-center";
      li.innerHTML = `
        <img src="${item.imagen}" alt="${
        item.nombre
      }" class="size-12 object-cover mr-2">
        <div class="flex-grow">
          <p class="font-semibold">${item.nombre}</p>
          <p>${item.cantidad} x $${item.precio.toFixed(0)} = $${(
        item.precio * item.cantidad
      ).toFixed(0)}</p>
        </div>
      `;
      itemsList.appendChild(li);
    });
  }

  if (total) {
    const totalPrecio = carrito.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    total.textContent = totalPrecio.toFixed(0);
  }
}

export { carrito, cargarCarrito };
