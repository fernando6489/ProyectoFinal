document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("searchToggle");
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  // Mostrar/ocultar el cuadro de texto
  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
    if (!form.classList.contains("hidden")) {
      input.focus();
    }
  });

  // Al enviar, redirige a la página de resultados
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      // Redirige a Productos.html con el parámetro de búsqueda
      window.location.href = "/pages/Productos.html?q=" + encodeURIComponent(query);
    }
  });
});