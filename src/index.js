import { carrito, cargarCarrito } from "./pages/carritoTienda";

// Función para cargar el SDK de MercadoPago
function loadMercadoPagoSDK() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.onload = () => resolve(window.MercadoPago);
        script.onerror = () => reject(new Error('Failed to load MercadoPago SDK'));
        document.body.appendChild(script);
    });
}

// Función principal que se ejecutará cuando el SDK esté cargado
async function initMercadoPago() {
    try {
        const MercadoPago = await loadMercadoPagoSDK();
        const mp = new MercadoPago("APP_USR-d7b7e68a-1253-4b37-a2ce-88d3f1299f96", {
            locale: "es-AR",
        });

        document.getElementById("checkout-button").addEventListener("click", async () => {
            try {

                await cargarCarrito()

                const cartItems = await getCartItems();
                if (cartItems.length === 0) {
                    console.error("El carrito está vacío");
                    return;
                }

                const orderData = {
                    items: cartItems
                };

                console.log("Datos de la orden:", orderData);

                const response = await fetch("https://mistercafebackend-b3cj6p1v.b4a.run/pay", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
                }

                const preference = await response.json();
                createCheckoutButton(preference.id);
            } catch (error) {
                console.error("Error al crear la preferencia:", error);
            }
        });

        function createCheckoutButton(preferenceId) {
            const bricksBuilder = mp.bricks();

            bricksBuilder
                .create("wallet", "wallet_container", {
                    initialization: {
                        preferenceId: preferenceId,
                    },
                    customization: {
                        texts: {
                            valueProp: "smart_option",
                        },
                    },
                })
                .then(() => {
                    console.log("Botón de pago creado con éxito");
                })
                .catch((error) => {
                    console.error("Error al crear el botón de pago:", error);
                });
        }
    } catch (error) {
        console.error("Error al inicializar MercadoPago:", error);
    }
}

// Nueva función para obtener los items del carrito
function getCartItems() {
    // Utilizamos la variable carrito importada de carritoTienda
    return carrito.map(item => ({
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'ARS',
        description: item.descripcion || ''
    }));
}

// Ejecutar la función principal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initMercadoPago);
