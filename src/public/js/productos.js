let page = 1;
let loading = false;
const productosContainer = document.getElementById("productos-container");
const loader = document.getElementById("loader");
const noProductos = document.getElementById("no-productos");

async function cargarProductos() {
  if (loading) return;
  loading = true;
  loader.classList.remove("d-none");

  try {
    const res = await fetch(`/api/productos?page=${page}&limit=6`);
    const data = await res.json();

    // Si la API trae un state:false o productos vacío
    if (!data.state || !data.productos || data.productos.length === 0) {
      if (page === 1) {
        noProductos.classList.remove("d-none");
      }
      window.removeEventListener("scroll", handleScroll);
      loader.classList.add("d-none");
      return;
    }

    // Renderizar productos
    data.productos.forEach(prod => {
      const card = document.createElement("div");
card.className = "post-card";
card.innerHTML = `
  <img src="${prod.imagen || 'https://via.placeholder.com/600x400'}" alt="${prod.titulo}">
  <div class="card-body">
    <div class="user-info mb-2">@${prod.usuarioId?.nombre || "usuario"}</div>
    <h5 class="card-title">${prod.titulo}</h5>
    <p class="card-text">${prod.descripcion || "Sin descripción disponible"}</p>
    <div class="d-flex justify-content-between align-items-center">
      <span class="price">$${prod.precio || "0.00"}</span>
      <button class="btn btn-outline-primary btn-sm">Ver Contacto</button>
    </div>
  </div>
`;

      productosContainer.appendChild(card);
    });

    page++; // Avanzar a la siguiente página
  } catch (error) {
    console.error("Error al cargar productos:", error);
  } finally {
    loader.classList.add("d-none");
    loading = false;
  }
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    cargarProductos();
  }
}

// Inicial
cargarProductos();
window.addEventListener("scroll", handleScroll);
