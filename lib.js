const debugMode = true;

/**
 * Registra un mensaje de depuración en la consola, si el modo de depuración está activado.
 *
 * @param {string} text - El mensaje de depuración a registrar.
 *
 * @returns {void}
 *
 * @example
 * // Registrar un mensaje de depuración
 * debug('Valor de la variable x: ' + x);
 *
 * @note
 * Esta función asume que la variable global `debugMode` está definida y es booleana.
 * Si `debugMode` no está definida, no se registrará ningún mensaje.
 */
function debug(text) {
    if(debugMode==true) {
        console.log(text);
    }
}

/**
 * Agrega o reemplaza contenido HTML en un elemento del DOM.
 *
 * @param {string} what - El contenido HTML a agregar o reemplazar.
 * @param {string} where - El selector CSS del elemento del DOM donde se aplicará el cambio.
 * @param {string} [flag="w"] - El modo de operación, ya sea "w" (reemplazar) o "a" (agregar).
 *                             Si se omite, se utilizará el modo "reemplazar" por defecto.
 *
 * @returns {void}
 *
 * @example
 * // Reemplazar el contenido de un elemento
 * addHTML('<h1>Nuevo título</h1>', '#main-heading');
 *
 * // Agregar contenido a un elemento
 * addHTML('<p>Párrafo adicional</p>', '#content', 'a');
 *
 * @throws {Error} Si el valor de 'flag' no es 'w', 'W', 'a' o 'A'.
 */
function addHTML(what, where, flag = "w") {
    switch (flag) {
        case "w":
        case "W":
            document.querySelector(where).innerHTML = what;
            break;
        case "a":
        case "A":
            document.querySelector(where).innerHTML += what;
            break;
        default:
            console.error("El valor de 'flag' debe ser 'w', 'W', 'a' o 'A'.");
    }
}

/**
 * Realiza una solicitud HTTP GET a una URL específica y devuelve el contenido JSON de la respuesta.
 *
 * @param {string} url - La URL de la solicitud HTTP GET.
 * @param {Object} headers - Un objeto que contiene los encabezados HTTP a incluir en la solicitud.
 *
 * @returns {Promise<string>} - Una promesa que se resuelve con el contenido JSON de la respuesta, o "error" si ocurre un error.
 *
 * @example
 * // Leer el contenido JSON de una URL con encabezados personalizados
 * const headers = { "x-api-key": "...", "Content-Type": "application/json" };
 * const url = https://api.tatum.io/v3/polygon/address/x...M/2
 * readJson(url, headers)
 *   .then(json => console.log(json))
 *   .catch(error => console.error(error));
 *
 * @note
 * Esta función utiliza la función `debug()` para registrar mensajes de depuración. Asegúrate de que la función `debug()` esté definida y funcione correctamente y debugMode definido
 *
 * @throws {Error} - Si ocurre un error durante la solicitud HTTP.
 */
async function readJson(url,headers) {
    var myHeaders = new Headers();
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          debug(`${key}: ${headers[key]}`);
          myHeaders.append(key, headers[key]);
        }
    }
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    return await fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            debug(result);
            alert(1)
            return(result);
        })
        .catch(error => {
            alert(2)
            console.log('error', error)
            return "error"
        });
}

/**
 * Envía un objeto JSON a una URL mediante una solicitud HTTP POST.
 *
 * @param {string} url - La URL de la solicitud HTTP POST.
 * @param {Object} headers - Un objeto que contiene los encabezados HTTP a incluir en la solicitud.
 * @param {Object} jsonInfo - El objeto JSON a enviar en el cuerpo de la solicitud.
 *
 * @returns {Promise<string>} - Una promesa que se resuelve con la respuesta de texto de la solicitud, o "error" si ocurre un error.
 *
 * @example
 * // Enviar un objeto JSON a una URL con encabezados personalizados
 * const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer my-access-token' };
 * const jsonData = { name: 'John Doe', email: 'john.doe@example.com' };
 * writeJson('https://api.example.com/users', headers, jsonData)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 *
 * @note
 * Esta función utiliza la función `debug()` para registrar mensajes de depuración. Asegúrate de que la función `debug()` esté definida y funcione correctamente.
 *
 * @throws {Error} - Si ocurre un error durante la solicitud HTTP.
 */
async function writeJson(url, headers, jsonInfo) {
    var myHeaders = new Headers();
    for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          debug(`${key}: ${headers[key]}`);
          myHeaders.append(key, headers[key]);
        }
    }
    var raw = JSON.stringify(jsonInfo);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    return await fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            debug(result);
            return(result);
        })
        .catch(error => {
            alert(error)
            console.log('error', error)
            return "error"
        });
}

/**
 * Función para hacer que cualquier elemento e convierta en arrastrable dentro de un elemento limitante.
 *
 * @param {string} elementId - ID del elemento que se desea hacer arrastrable.
 * @param {string} limitElementId - ID del elemento que actuará como límite del área de arrastre.
 * @param {number} [zIndexMax=0] - Valor máximo permitido para el z-index del elemento arrastrable.
 *
 * @example
 * makeDraggable('myDraggableElement', 'myLimitingElement', 100);
 * makeDraggable("my-element-id", "pantalla-id",10000)
 * makeDraggable("my-element2-id", "pantalla-id",10000)
 * makeDraggable("pantalla-id", "body-id")
 *
 * @description
 * Esta función convierte un elemento en arrastrable, permitiendo al usuario moverlo dentro de los límites de otro elemento.
 * El elemento arrastrable mantendrá su posición absoluta y se moverá siguiendo los movimientos del cursor.
 * Además, el elemento arrastrable tendrá su cursor cambiado a "move" para indicar que es arrastrable.
 * El z-index del elemento arrastrable aumentará mientras se esté arrastrando, y se mantendrá dentro del valor máximo especificado.
 * Si el elemento arrastrable se superpone con otros elementos, su z-index se ajustará para mantener el orden visual correcto.
 */
function makeDraggable(elementId, limitElementId, zIndexMax=0) {
    // Obtener el elemento a convertir en arrastrable
    const element = document.getElementById(elementId);
    element.style.cursor = 'move';
    element.style.position = "absolute"

    // Obtener el elemento que actuará como límite
    const limitElement = document.getElementById(limitElementId);

    // Variables para almacenar la posición del mouse
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let active = false;

    let zIndex = 0;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('mouseup', dragEnd);
    element.addEventListener('mousemove', drag);

    function dragStart(e) {
        zIndex = this.style.zIndex;
        this.style.zIndex = Number(zIndex) + 100000;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === element) {
            active = true;
        }
    }

    function dragEnd(e) {
        console.log(trackMousePosition(this.id));
        idtop = trackMousePosition(this.id);
        if(idtop!="") {
            this.style.zIndex = Number(document.querySelector("#"+idtop).style.zIndex) +1;
        }else {
            this.style.zIndex = zIndex;
        }
        if(this.style.zIndex>zIndexMax) {
            this.style.zIndex = zIndexMax;
        }
        initialX = currentX;
        initialY = currentY;

        active = false;
    }

    function drag(e) {
        if (active) {
            e.preventDefault();

            if (e.target === element) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Limitar el movimiento dentro de los límites del elemento limitante
                const limitRect = limitElement.getBoundingClientRect();
                currentX = Math.max(Math.min(currentX, limitRect.right - element.offsetWidth), limitRect.left);
                currentY = Math.max(Math.min(currentY, limitRect.bottom - element.offsetHeight), limitRect.top);

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, element);
            }
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function trackMousePosition(id) {
        const elementsUnderMouse = document.elementsFromPoint(event.clientX, event.clientY);
        for (const element of elementsUnderMouse) {
            if(id != element.id) {
                const sortedElements = elementsUnderMouse.sort((a, b) => b.style.zIndex - a.style.zIndex);
                const elementIds = sortedElements.map(el => el.id);
                const elementIndex = elementsUnderMouse.indexOf(element);
                return(elementIds[elementIndex])
                console.log(elementIds[elementIndex]);
            }
        }
    }
}

/**
 * Función para extraer el HTML, CSS y JavaScript de la página actual.
 *
 * @returns {Object} - Un objeto con las siguientes propiedades:
 * @returns {string} html - El código HTML de la página actual.
 * @returns {string} css - El código CSS de la página actual, incluido el CSS inline y externo.
 * @returns {string} js - El código JavaScript de la página actual, incluido el JavaScript inline.
 *
 * @example
 const { html, css, js } = getPageSnapshot();
 console.log('HTML:\n', html);
 console.log('CSS:\n', css);
 console.log('JavaScript:\n', js);
 *
 * @description
 * Esta función extrae el HTML, CSS y JavaScript de la página actual. El HTML se extrae directamente del `document.documentElement.outerHTML`.
 * El CSS se extrae de los estilos inline y de las hojas de estilo externas. El JavaScript se extrae de los scripts inline.
 * El HTML devuelto no incluirá los estilos y scripts inline, ya que estos se extraen por separado.
 * Esta función puede ser útil para realizar cambios en la página después de ejecutar acciones como arrastrar y soltar (drag and drop).
 */

 function getPageSnapshot() {
    // Obtener el HTML actual de la página
    let html = `\`\`\`html
    ${document.documentElement.outerHTML}
    \`\`\``;

    // Generar el CSS
    let css = `\`\`\`css
    `;
    // Generar el JavaScript
    let js = `\`\`\`javascript
    `;

    // Extraer el CSS inline del HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.replace(/```html/g, '').replace(/```/g, '');
    const inlineStyles = tempDiv.querySelectorAll('[id]');
    inlineStyles.forEach(element => {
        css += `#${element.id} {\n`;
        const style = element.getAttribute('style');
        if (style) {
            const styles = style.split(';');
            styles.forEach(style => {
                if (style.trim() !== '') {
                    const [property, value] = style.split(':');
                    css += `  ${property.trim()}: ${value.trim()};\n`;
                }
            });
        }
        css += `}\n`;
    });

    // Extraer el JavaScript inline del HTML
    const inlineScripts = tempDiv.querySelectorAll('script');
    inlineScripts.forEach(script => {
        if (script.textContent.trim() !== '') {
            js += script.textContent.trim() + '\n';
        }
    });

    // Obtener el CSS externo
    for (let i = 0; i < document.styleSheets.length; i++) {
        const stylesheet = document.styleSheets[i];
        if (stylesheet.cssRules) {
            for (let j = 0; j < stylesheet.cssRules.length; j++) {
                css += stylesheet.cssRules[j].cssText + '\n';
            }
        }
    }
    css += `\`\`\``;

    // Eliminar el CSS y JavaScript inline del HTML
    html = html.replace(/<[^>]+style="[^"]*"[^>]*>/g, (match) => {
        return match.replace(/style="[^"]*"/g, '');
    });
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');

    return { html, css, js };
}

/**
 * Función para crear un modal en la página adisionandolo al dom
 *
 * @param {string} modalHtml - El código HTML del contenido del modal.
 * @param {string} modalCss - El código CSS para el estilo del modal.
 * @param {number} width - El ancho del modal en píxeles.
 * @param {number} height - La altura del modal en píxeles.
 * @param {number} top - La distancia desde la parte superior de la página en píxeles.
 * @param {number} left - La distancia desde el lado izquierdo de la página en píxeles.
 * @param {string} modalId - El ID único que se asignará al elemento del modal.
 *
 * @example
 * const modalHtml = `
 *     <h2>Mi Modal</h2>
 *     <p>Este es el contenido de mi modal.</p>
 * `;
 *
 * const modalCss = `
 *     .modal h2 {
 *         color: blue;
 *     }
 *     .modal p {
 *         font-size: 16px;
 *     }
 * `;
 *
 * createModal(modalHtml, modalCss, 400, 300, 100, 200, 'my-modal-id');
 * openModal('my-modal-id'); // funcion extra relacionada
 * closeModal('my-modal-id'); // funcion extra relacionada
 * destroyModal('my-modal-id'); // funcion extra relacionada
 *
 * @description
 * Esta función crea un elemento modal y lo agrega al documento. El modal se posiciona de manera fija en la página y se puede personalizar su tamaño, posición y contenido.
 * El HTML y CSS del modal se pasan como parámetros a la función, lo que permite una gran flexibilidad en la apariencia y el comportamiento del modal.
 * Una vez creado, el modal se puede mostrar, ocultar o eliminar según sea necesario.
 */
function createModal(modalHtml, modalCss, width, height, top, left, modalId) {
    // Crear el elemento del modal
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.classList.add('modal');

    // Establecer el estilo del modal
    modal.style.position = 'fixed';
    modal.style.top = `${top}px`;
    modal.style.left = `${left}px`;
    modal.style.width = `${width}px`;
    modal.style.height = `${height}px`;
    modal.style.zIndex = '9999';
    modal.style.backgroundColor = 'white';
    modal.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    modal.style.overflow = 'auto';

    // Agregar el HTML y CSS del modal
    modal.innerHTML = modalHtml;
    const style = document.createElement('style');
    style.textContent = modalCss;
    modal.appendChild(style);

    // Agregar el modal al documento
    document.body.appendChild(modal);
}

/**
 * Función para mostrar un modal en la página.
 *
 * @param {string} modalId - El ID único del elemento del modal que se va a mostrar.
 *
 * @example
 * openModal('my-modal-id');
 *
 * @description
 * Esta función se utiliza para mostrar un modal que ha sido previamente creado con la función `createModal()`.
 * Primero, la función busca el elemento del modal en el DOM utilizando el ID proporcionado.
 * Si el modal se encuentra, se crea un elemento de superposición (overlay) con un fondo oscuro y borroso, y se agrega al documento.
 * Luego, se establece la propiedad `display` del elemento del modal en `'block'` para hacerlo visible.
 * Si no se encuentra un modal con el ID proporcionado, se muestra un mensaje de error en la consola.
 */
function openModal(modalId) {
    // Obtener el modal por su ID
    const modal = document.getElementById(modalId);

    if (modal) {
        // Crear el fondo de pantalla oscuro y borroso
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.zIndex = '9998';

        // Agregar el fondo al documento
        document.body.appendChild(overlay);

        // Mostrar el modal
        modal.style.display = 'block';
    } else {
        console.error(`No se encontró el modal con el ID "${modalId}".`);
    }
}

/**
 * Función para cerrar un modal y eliminar su overlay correspondiente.
 *
 * @param {string} modalId - El ID único del elemento del modal que se va a cerrar.
 *
 * @example
 * closeModal('my-modal-id');
 *
 * @description
 * Esta función se utiliza para cerrar un modal y eliminar su overlay (fondo oscuro y borroso) del DOM.
 * Primero, la función busca el elemento del modal en el DOM utilizando el ID proporcionado.
 * Si el modal se encuentra, se oculta estableciendo su propiedad `display` en `'none'`.
 * A continuación, se obtienen todos los overlays (fondos de pantalla oscuros y borrosos) presentes en el documento.
 * Si solo hay un modal abierto, se elimina el overlay correspondiente.
 * Si hay más de un modal abierto, se elimina solo el overlay correspondiente al modal que se está cerrando.
 * Si no se encuentra un modal con el ID proporcionado, se muestra un mensaje de error en la consola.
 * Cabe destacar que esta función no elimina el modal del DOM, solo lo oculta. Para eliminar el modal por completo, debes utilizar la función `destroyModal(modalId)`.
 */
function closeModal(modalId) {
    // Obtener el modal por su ID
    const modal = document.getElementById(modalId);

    if (modal) {
        // Ocultar el modal
        modal.style.display = 'none';

        // Obtener todos los overlays
        const overlays = document.querySelectorAll('.modal-overlay');

        // Verificar cuántos modales están abiertos
        const openModals = document.querySelectorAll('.modal').length;

        // Si solo hay un modal abierto, eliminar el overlay
        if (openModals === 1) {
            overlays.forEach(overlay => overlay.remove());
        } else {
            // Si hay más de un modal abierto, eliminar solo el overlay correspondiente
            const overlay = document.querySelector(`.modal-overlay`);
            if (overlay) {
                overlay.remove();
            }
        }
    } else {
        console.error(`No se encontró el modal con el ID "${modalId}".`);
    }
}

/**
 * Función para eliminar un modal del DOM previamente creado con createModal(), independientemente de si el modal está abierto o cerrado.
 *
 * @param {string} modalId - El ID único del elemento del modal que se va a eliminar.
 *
 * @example
 * destroyModal('my-modal-id');
 *
 * @description
 * Esta función se utiliza para eliminar un modal del DOM, ya sea que el modal esté abierto o cerrado.
 * Primero, la función busca el elemento del modal en el DOM utilizando el ID proporcionado.
 * Si el modal se encuentra, se oculta estableciendo su propiedad `display` en `'none'`.
 * Después de un breve retraso de 300 milisegundos, se elimina el modal del DOM utilizando el método `remove()`.
 * A continuación, se obtienen todos los overlays (fondos de pantalla oscuros y borrosos) presentes en el documento.
 * Si solo hay un modal abierto, se elimina el overlay correspondiente.
 * Si hay más de un modal abierto, se elimina solo el overlay correspondiente al modal que se está cerrando.
 * Si no se encuentra un modal con el ID proporcionado, se muestra un mensaje de error en la consola.
 */
function destroyModal(modalId) {
    // Obtener el modal por su ID
    const modal = document.getElementById(modalId);

    if (modal) {
        // Ocultar el modal
        modal.style.display = 'none';

        // Esperar 300ms para asegurarse de que el modal está oculto
        setTimeout(() => {
            // Eliminar el modal del DOM
            modal.remove();

            // Obtener todos los overlays
            const overlays = document.querySelectorAll('.modal-overlay');

            // Verificar cuántos modales están abiertos
            const openModals = document.querySelectorAll('.modal').length;

            // Si solo hay un modal abierto, eliminar el overlay
            if (openModals === 0) {
                overlays.forEach(overlay => overlay.remove());
            } else {
                // Si hay más de un modal abierto, eliminar solo el overlay correspondiente
                const overlay = document.querySelector(`.modal-overlay`);
                if (overlay) {
                    overlay.remove();
                }
            }
        }, 300);
    } else {
        console.error(`No se encontró el modal con el ID "${modalId}".`);
    }
}

/**
 * Función para crear y agregar un spinner al DOM.
 *
 * @param {string} spinnerImage - La URL de la imagen que se utilizará como spinner.
 * @param {number} width - El ancho del spinner en píxeles.
 * @param {number} height - El alto del spinner en píxeles.
 * @param {string} spinnerId - El ID único que se asignará al elemento del spinner.
 *
 * @example
 * createSpinner('https://example.com/spinner.gif', 50, 50, 'my-spinner-id');
 *
 * @description
 * Esta función crea un elemento `div` que representa el spinner y lo agrega al `document.body`.
 * El spinner se posiciona de forma fija en el centro de la pantalla y se le aplica una animación de rotación continua.
 * Los estilos del spinner, incluyendo la animación de rotación, se definen directamente en el código.
 * El spinner se inicializa con `display: none`, por lo que no es visible hasta que se llama a la función `openSpinner()`.
 */
function createSpinner(spinnerImage, width, height, spinnerId) {
    // Crear el elemento del spinner
    const spinner = document.createElement('div');
    spinner.id = spinnerId;
    spinner.classList.add('spinner');
  
    // Establecer el estilo del spinner
    spinner.style.position = 'fixed';
    spinner.style.width = `${width}px`;
    spinner.style.height = `${height}px`;
    spinner.style.zIndex = '9999';
    spinner.style.backgroundImage = `url(${spinnerImage})`;
    spinner.style.backgroundSize = 'contain';
    spinner.style.backgroundRepeat = 'no-repeat';
    spinner.style.backgroundPosition = 'center';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.display = 'none'; // Inicialmente oculto
  
    // Agregar la animación de rotación
    spinner.style.animation = 'spin 1s linear infinite';
    const spinAnimation = document.createElement('style');
    spinAnimation.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinAnimation);
  
    // Agregar el spinner al documento
    document.body.appendChild(spinner);
}
  
/**
 * Abre un spinner existente en la página.
 *
 * @param {string} spinnerId - El ID del elemento spinner a abrir.
 * @param {number} spinSpeed - La velocidad de la animación del spinner, expresada como un valor entre 0 y 100, donde 100 es la velocidad más rápida.
 *
 * @returns {void}
 *
 * @example
 * openSpinner('mi-spinner', 50);
 *
 * @description
 * Esta función crea un fondo oscuro y borroso, y muestra el elemento spinner con la velocidad de giro especificada.
 *
 * 1. La función primero recupera el elemento spinner usando el `spinnerId` proporcionado.
 * 2. Si se encuentra el elemento spinner, la función crea un nuevo elemento `div` con la clase `spinner-overlay` y lo agrega al `document.body`.
 * 3. El elemento `spinner-overlay` cubre todo el viewport y tiene un fondo negro semi-transparente con un efecto de desenfoque.
 * 4. Se establece la propiedad `display` del elemento spinner en `block` para hacerlo visible.
 * 5. La velocidad de la animación del spinner se calcula en función del valor de `spinSpeed` proporcionado, que debe estar entre 0 y 100. La velocidad se limita a 100 si el valor proporcionado excede ese límite.
 * 6. Luego, el elemento spinner se anima con una animación `spin` a la velocidad calculada.
 * 7. Si no se encuentra el elemento spinner, la función registra un mensaje de error en la consola.
 */
function openSpinner(spinnerId, spinSpeed) {
    // Obtener el spinner por su ID
    const spinner = document.getElementById(spinnerId);

    if (spinner) {
        // Crear el fondo de pantalla oscuro y borroso
        const overlay = document.createElement('div');
        overlay.classList.add('spinner-overlay');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.zIndex = '9998';

        // Agregar el fondo al documento
        document.body.appendChild(overlay);

        // Mostrar el spinner y hacerlo girar
        spinner.style.display = 'block';
        if(spinSpeed>100) {
            spinSpeed = 100;
        }
        spinSpeed = spinSpeed / 10;
        console.log(spinSpeed)
        spinner.style.animation = 'spin '+(spinSpeed)+'s linear infinite';
    } else {
        console.error(`No se encontró el spinner con el ID "${spinnerId}".`);
    }
}
  
/**
 * Cierra un spinner existente en la página.
 *
 * @param {string} spinnerId - El ID del elemento spinner a cerrar.
 *
 * @returns {void}
 *
 * @example
 * closeSpinner('mi-spinner');
 *
 * @description
 * Esta función cierra un spinner existente en la página. Específicamente:
 *
 * 1. Primero se obtiene el elemento spinner usando el `spinnerId` proporcionado.
 * 2. Si se encuentra el elemento spinner, se establece su propiedad `display` en `none` para ocultarlo y se elimina la animación.
 * 3. Luego, se obtienen todos los elementos con la clase `spinner-overlay` (que son los fondos oscuros y borrosos creados por la función `openSpinner()`).
 * 4. Se verifica cuántos spinners están actualmente abiertos en la página.
 * 5. Si solo hay un spinner abierto, se eliminan todos los elementos `spinner-overlay`.
 * 6. Si hay más de un spinner abierto, se elimina solo el elemento `spinner-overlay` correspondiente al spinner que se está cerrando.
 * 7. Si no se encuentra el elemento spinner, se registra un mensaje de error en la consola.
 */
function closeSpinner(spinnerId) {
    // Obtener el spinner por su ID
    const spinner = document.getElementById(spinnerId);

    if (spinner) {
        // Ocultar el spinner
        spinner.style.display = 'none';
        spinner.style.animation = 'none';

        // Obtener todos los overlays
        const overlays = document.querySelectorAll('.spinner-overlay');

        // Verificar cuántos spinners están abiertos
        const openSpinners = document.querySelectorAll('.spinner').length;

        // Si solo hay un spinner abierto, eliminar el overlay
        if (openSpinners === 1) {
            overlays.forEach(overlay => overlay.remove());
        } else {
            // Si hay más de un spinner abierto, eliminar solo el overlay correspondiente
            const overlay = document.querySelector(`.spinner-overlay`);
            if (overlay) {
                overlay.remove();
            }
        }
    } else {
        console.error(`No se encontró el spinner con el ID "${spinnerId}".`);
    }
}
  
/**
 * Destruye un spinner existente en la página.
 *
 * @param {string} spinnerId - El ID del elemento spinner a destruir.
 *
 * @returns {void}
 *
 * @example
 * destroySpinner('mi-spinner');
 *
 * @description
 * Esta función elimina por completo un spinner existente en la página. Específicamente:
 *
 * 1. Primero se obtiene el elemento spinner usando el `spinnerId` proporcionado.
 * 2. Si se encuentra el elemento spinner, se establece su propiedad `display` en `none` para ocultarlo.
 * 3. Luego, se espera 300 milisegundos para asegurarse de que el spinner esté completamente oculto.
 * 4. Después de 300 milisegundos, se elimina el elemento spinner del DOM.
 * 5. Se obtienen todos los elementos con la clase `spinner-overlay` (que son los fondos oscuros y borrosos creados por la función `openSpinner()`).
 * 6. Se verifica cuántos spinners están actualmente abiertos en la página.
 * 7. Si no hay más spinners abiertos, se eliminan todos los elementos `spinner-overlay`.
 * 8. Si todavía hay otros spinners abiertos, se elimina solo el elemento `spinner-overlay` correspondiente al spinner que se está destruyendo.
 * 9. Si no se encuentra el elemento spinner, se registra un mensaje de error en la consola.
 */
function destroySpinner(spinnerId) {
    // Obtener el spinner por su ID
    const spinner = document.getElementById(spinnerId);

    if (spinner) {
        // Ocultar el spinner
        spinner.style.display = 'none';

        // Esperar 300ms para asegurarse de que el spinner está oculto
        setTimeout(() => {
            // Eliminar el spinner del DOM
            spinner.remove();

            // Obtener todos los overlays
            const overlays = document.querySelectorAll('.spinner-overlay');

            // Verificar cuántos spinners están abiertos
            const openSpinners = document.querySelectorAll('.spinner').length;

            // Si solo hay un spinner abierto, eliminar el overlay
            if (openSpinners === 0) {
                overlays.forEach(overlay => overlay.remove());
            } else {
                // Si hay más de un spinner abierto, eliminar solo el overlay correspondiente
                const overlay = document.querySelector(`.spinner-overlay`);
                if (overlay) {
                    overlay.remove();
                }
            }
        }, 300);
    } else {
        console.error(`No se encontró el spinner con el ID "${spinnerId}".`);
    }
}

/**
 * Extrae los valores capturados por una expresión regular en un texto dado.
 *
 * @param {string} text - El texto en el que se realizará la búsqueda.
 * @param {string} regex - La expresión regular en formato de cadena de texto.
 * @returns {string[]} - Un array con los valores capturados por los grupos de captura de la expresión regular.
 *
 * @example
 * const text = "Hola, mi nombre es cris y tengo 60 años.";
 * const regex = "Hola, mi nombre es (.*) y tengo (.*) años.";
 * const values = extractValues(text, regex);
 * console.log(values); // Output: ["cris", "60"]
 */
function extractValues(text,regex) {
    regex = new RegExp(regex);
    const matches = text.match(regex);
    if (matches) {
        return matches.slice(1); // Retorna todos los grupos de captura excepto el primero
    } else {
        return [];
    }
}

/**
 * Extrae una subcadena de un string dado, mostrando los caracteres iniciales y finales.
 *
 * @description
 * Esta función es útil cuando se desea mostrar solo una parte visible de un string largo, 
 * manteniendo los primeros y últimos caracteres para proporcionar contexto. Devuelve una
 * nueva cadena que contiene los caracteres iniciales y finales de la subcadena extraída.
 *
 * @param {string} str - El string original del cual se extraerá la subcadena.
 * @param {number} start - El índice de inicio de la subcadena a extraer.
 * @param {number} end - El número de caracteres finales a incluir en la subcadena.
 * @returns {string} - Una nueva cadena que contiene los caracteres iniciales y finales de la subcadena extraída.
 *
 * @example
 * const originalString = "0x06Eb67071a06E676b678F5dd3614D852C129d460";
 * const result = sliceString(originalString, 6, 4);
 * console.log(result); // Output: "0x06Eb...460"
 */
function sliceString(str, start, end) {
    const first = str.slice(0, start);
    if(end==0) {
        return first+"..."
    }else {
        const last = str.slice(-end);
        return first+"..."+last;
    }
}

/**
 * Dibuja una línea entre dos puntos en un elemento canvas.
 * 
 * Esta función crea un elemento canvas si no existe uno y luego dibuja una línea entre las coordenadas de inicio y fin especificadas. El color de la línea se puede personalizar mediante el parámetro opcional `color`.
 * 
 * @param {number} startX - La coordenada x del punto de inicio de la línea.
 * @param {number} startY - La coordenada y del punto de inicio de la línea.
 * @param {number} endX - La coordenada x del punto final de la línea.
 * @param {number} endY - La coordenada y del punto final de la línea.
 * @param {string} [color='black'] - El color de la línea. Valor predeterminado es 'black'.
 * 
 * @example
 * // Dibujar una línea roja desde (100, 100) hasta (400, 400)
 * drawLine(100, 100, 400, 400, 'red');
 * 
 * // Dibujar una línea negra desde (50, 50) hasta (250, 250)
 * drawLine(50, 50, 250, 250);
 * 
 * @returns {void}
 */
function drawLine(startX, startY, endX, endY, color = 'black') {
    // Crea un elemento canvas si no existe uno
    let canvas = document.getElementById('myCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'myCanvas';
        canvas.width = 500;
        canvas.height = 500;
        document.body.appendChild(canvas);
    }

    // Obtiene el contexto 2D del canvas
    const ctx = canvas.getContext('2d');

    // Establece el color de la línea
    ctx.strokeStyle = color;

    // Comienza el dibujo de la línea
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}


// No probadas

/**
 * Elimina uno o más elementos HTML de la página según un selector CSS.
 *
 * @param {string|string[]} selector - El selector CSS de los elementos a eliminar. Puede ser una cadena de texto o un array de cadenas de texto.
 *
 * @returns {void}
 *
 * @example
 * // Eliminar un elemento por su ID
 * removeElements('#my-element');
 *
 * // Eliminar varios elementos por su clase
 * removeElements('.my-elements');
 *
 * // Eliminar múltiples elementos usando un array de selectores
 * removeElements(['#element1', '.element2', 'div.element3']);
 *
 * @description
 * Esta función recibe un selector CSS como parámetro, ya sea una cadena de texto o un array de cadenas de texto. Luego, utiliza este selector para seleccionar los elementos correspondientes en el DOM y eliminarlos.
 *
 * Si el parámetro `selector` es una cadena de texto, la función selecciona y elimina los elementos que coinciden con ese selector.
 *
 * Si el parámetro `selector` es un array de cadenas de texto, la función selecciona y elimina todos los elementos que coinciden con cualquiera de los selectores en el array.
 *
 * La función no devuelve nada (tipo de retorno `void`).
 */
function removeElements(selector) {
    // Verificar si el selector es una cadena o un array
    const selectors = Array.isArray(selector) ? selector : [selector];

    // Seleccionar y eliminar los elementos para cada selector
    selectors.forEach(sel => {
        const elements = document.querySelectorAll(sel);
        elements.forEach(el => el.remove());
    });
}

/**
 * Guarda un valor en el almacenamiento web (localStorage o sessionStorage).
 *
 * @description
 * Esta función permite almacenar un valor en el almacenamiento web (ya sea localStorage o sessionStorage)
 * utilizando una clave proporcionada. Si la clave ya existe, el valor asociado se sobrescribirá.
 *
 * @param {string} key - La clave bajo la cual se almacenará el valor.
 * @param {string|number|boolean|object|array} value - El valor a almacenar.
 * @param {string} [storage='localStorage'] - El tipo de almacenamiento a utilizar: 'localStorage' o 'sessionStorage'.
 * @returns {void}
 *
 * @example
 * // Guardar un valor en localStorage
 * saveToStorage('myKey', 'myValue');
 *
 * // Guardar un valor en sessionStorage
 * saveToStorage('anotherKey', { name: 'John Doe' }, 'sessionStorage');
 */
function saveToStorage(key, value, storage = 'localStorage') {
    if (storage === 'localStorage') {
        localStorage.setItem(key, JSON.stringify(value));
    } else if (storage === 'sessionStorage') {
        sessionStorage.setItem(key, JSON.stringify(value));
    } else {
        throw new Error('Invalid storage type. Must be "localStorage" or "sessionStorage".');
    }
}

/**
 * Recupera un valor del almacenamiento web (localStorage o sessionStorage).
 *
 * @description
 * Esta función permite leer un valor almacenado en el almacenamiento web (ya sea localStorage o sessionStorage)
 * utilizando una clave proporcionada. Si la clave no existe, se devuelve `null`.
 *
 * @param {string} key - La clave bajo la cual se encuentra el valor almacenado.
 * @param {string} [storage='localStorage'] - El tipo de almacenamiento a utilizar: 'localStorage' o 'sessionStorage'.
 * @returns {string|number|boolean|object|array|null} - El valor almacenado, o `null` si la clave no existe.
 *
 * @example
 * // Leer un valor de localStorage
 * const myValue = readFromStorage('myKey');
 * console.log(myValue); // Output: 'myValue'
 *
 * // Leer un valor de sessionStorage
 * const anotherValue = readFromStorage('anotherKey', 'sessionStorage');
 * console.log(anotherValue); // Output: { name: 'John Doe' }
 */
function readFromStorage(key, storage = 'localStorage') {
    if (storage === 'localStorage') {
        return JSON.parse(localStorage.getItem(key));
    } else if (storage === 'sessionStorage') {
        return JSON.parse(sessionStorage.getItem(key));
    } else {
        throw new Error('Invalid storage type. Must be "localStorage" or "sessionStorage".');
    }
}

/**
 * Elimina un valor del almacenamiento web (localStorage o sessionStorage).
 *
 * @description
 * Esta función permite eliminar un valor almacenado en el almacenamiento web (ya sea localStorage o sessionStorage)
 * utilizando una clave proporcionada. Si la clave no existe, no se realizará ninguna acción.
 *
 * @param {string} key - La clave del valor a eliminar.
 * @param {string} [storage='localStorage'] - El tipo de almacenamiento a utilizar: 'localStorage' o 'sessionStorage'.
 * @returns {void}
 *
 * @example
 * // Eliminar un valor de localStorage
 * removeFromStorage('myKey');
 *
 * // Eliminar un valor de sessionStorage
 * removeFromStorage('anotherKey', 'sessionStorage');
 */
function removeFromStorage(key, storage = 'localStorage') {
    if (storage === 'localStorage') {
        localStorage.removeItem(key);
    } else if (storage === 'sessionStorage') {
        sessionStorage.removeItem(key);
    } else {
        throw new Error('Invalid storage type. Must be "localStorage" or "sessionStorage".');
    }
}


////////// Tested and using classes

class MousePosition {
  constructor() {
    this.clickX = 0;
    this.clickY = 0;
    this.positionX = 0;
    this.positionY = 0;
    this.isMousePositionTrackingEnabled = false;
  }

  clicked(event) {
    if (this.isMousePositionTrackingEnabled) {
      this.clickX = event.clientX;
      this.clickY = event.clientY;
    }
  }

  mouseMoved(event) {
    this.positionX = event.clientX;
    this.positionY = event.clientY;
  }

  enable() {
    this.isMousePositionTrackingEnabled = true;
    document.addEventListener('click', this.clicked.bind(this));
    document.addEventListener('mousemove', this.mouseMoved.bind(this));
  }

  disable() {
    this.isMousePositionTrackingEnabled = false;
    document.removeEventListener('click', this.clicked.bind(this));
    document.removeEventListener('mousemove', this.mouseMoved.bind(this));
  }
}










/**
 * Función para extraer el HTML, CSS y JavaScript de un elemento específico de la página actual.
 *
 * @param {string} elementId - El ID del elemento del que se quiere extraer el snapshot.
 * @returns {Object} - Un objeto con las siguientes propiedades:
 * @returns {string} html - El código HTML del elemento.
 * @returns {string} css - El código CSS del elemento, incluido el CSS inline y externo.
 * @returns {string} js - El código JavaScript del elemento, incluido el JavaScript inline.
 *
 * @example
var elementId = 'preview-iframe';
var { html, css, js } = getElementSnapshot(elementId);
console.log('HTML:\n', html);
console.log('CSS:\n', css);
console.log('JavaScript:\n', js);
 */
function getElementSnapshot(elementId) {
    // Obtener el elemento por su ID
    const element = document.getElementById(elementId);
    if (!element) {
        return { html: '', css: '', js: '' };
    }

    // Obtener el HTML del elemento
    let html = `\`\`\`html
    ${element.outerHTML}
    \`\`\``;
    
    // Generar el CSS
    let css = `\`\`\`css
    `;
    // Generar el JavaScript
    let js = `\`\`\`javascript
    `;

    // Extraer el CSS inline del HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.replace(/```html/g, '').replace(/```/g, '');
    const inlineStyles = tempDiv.querySelectorAll('[id]');
    inlineStyles.forEach(element => {
        css += `#${element.id} {\n`;
        const style = element.getAttribute('style');
        if (style) {
            const styles = style.split(';');
            styles.forEach(style => {
                if (style.trim() !== '') {
                    const [property, value] = style.split(':');
                    css += `  ${property.trim()}: ${value.trim()};\n`;
                }
            });
        }
        css += `}\n`;
    });

    // Extraer el JavaScript inline del HTML
    const inlineScripts = tempDiv.querySelectorAll('script');
    inlineScripts.forEach(script => {
        if (script.textContent.trim() !== '') {
            js += script.textContent.trim() + '\n';
        }
    });

    // Obtener el CSS externo
    for (let i = 0; i < document.styleSheets.length; i++) {
        const stylesheet = document.styleSheets[i];
        if (stylesheet.cssRules) {
            for (let j = 0; j < stylesheet.cssRules.length; j++) {
                css += stylesheet.cssRules[j].cssText + '\n';
            }
        }
    }
    css += `\`\`\``;

    // Eliminar el CSS y JavaScript inline del HTML
    html = html.replace(/<[^>]+style="[^"]*"[^>]*>/g, (match) => {
        return match.replace(/style="[^"]*"/g, '');
    });
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');

    return { html, css, js };

}