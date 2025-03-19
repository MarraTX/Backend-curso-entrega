function addToCart(productId) {
  console.log("Frontend: Producto ID recibido:", productId);
  let cartId = localStorage.getItem("cartId");

  if (!cartId) {
    console.log(
      "Frontend: No hay cartId en localStorage, creando nuevo carrito"
    );
    createNewCart(productId);
  } else {
    console.log("Frontend: CartId encontrado en localStorage:", cartId);
    verifyCartAndAddProduct(cartId, productId);
  }
}

function createNewCart(productId) {
  console.log("Frontend: Creando nuevo carrito");
  fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al crear el carrito");
      }
      return response.json();
    })
    .then((data) => {
      const cartId = data.payload._id;
      console.log("Frontend: Nuevo carrito creado:", cartId);
      localStorage.setItem("cartId", cartId);
      return addProductToCart(cartId, productId);
    })
    .catch((error) => {
      console.error("Frontend Error en createNewCart:", error);
      alert("Error al crear el carrito: " + error.message);
    });
}

function verifyCartAndAddProduct(cartId, productId) {
  console.log("Frontend: Verificando carrito existente:", cartId);

  fetch(`/api/carts/${cartId}`)
    .then((response) => {
      if (!response.ok) {
        localStorage.removeItem("cartId");
        throw new Error("Carrito no encontrado");
      }
      return response.json();
    })
    .then(() => {
      return addProductToCart(cartId, productId);
    })
    .catch((error) => {
      console.log(
        "Frontend: Error al verificar carrito, creando uno nuevo:",
        error.message
      );
      createNewCart(productId);
    });
}

function addProductToCart(cartId, productId) {
  console.log(
    "Frontend: Intentando agregar producto:",
    productId,
    "al carrito:",
    cartId
  );

  return fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(
            data.error || "Error al agregar el producto al carrito"
          );
        } else {
          throw new Error("Error del servidor: " + response.status);
        }
      }
      return response.json();
    })
    .then((result) => {
      console.log("Frontend: Producto agregado exitosamente:", result);
      alert("Producto agregado al carrito exitosamente");
      window.location.href = `/carts/${cartId}`;
    })
    .catch((error) => {
      console.error("Frontend Error en addProductToCart:", error);
      if (error.message.includes("Carrito no encontrado")) {
        localStorage.removeItem("cartId");
        createNewCart(productId);
      } else {
        alert("Error al agregar el producto: " + error.message);
      }
    });
}
