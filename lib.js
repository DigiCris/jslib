const debugMode = true;

function debug(text) {
    if(debugMode==true) {
        console.log(text);
    }
}

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


/*
headers = {
        "x-api-key": "...",
        "Content-Type": "application/json"
}
url = https://api.tatum.io/v3/polygon/address/x...M/2

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


/*
headers = {
        "x-api-key": "...",
        "Content-Type": "application/json"
}

jsonInfo = {
  "method": "setAll",
  "id": 1,
  "shop": "Mc Donalds",
  "shopId": 1,
  "order": "Hamburguesa",
  "shipDate": "2024-03-29",
  "Status": "pendiente",
  "price": "$29.99",
  "pickAddress": "10 15",
  "deliveryAddress": "10 16",
  "quarrelDescription": "",
  "quarrelPicture": "",
  "reviewDescription": "",
  "reviewLevel": 6,
  "deliveryId": 1,
  "deliveryMoney": "$5.00",
  "userId": 123
}

url= "https://cursoblockchain.com.ar/flashivery/api/v1/order/setAll"
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



/*
Hacer que cualquier elemento se convierta en arrastrable
Funcionando

Al pasarle el id del un elemento este se convierte en dragable

makeDraggable('my-element-id');
makeDraggable('my-element2-id')
makeDraggable('pantalla-id');
*/
function makeDraggable(elementId) {
    // Obtener el elemento a convertir en arrastrable
    const element = document.getElementById(elementId);
    element.style.cursor = 'move';
    element.style.position = "absolute"
    //element.classList.add('draggable');

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
        zIndex = this.style.zIndex ;
        this.style.zIndex = Number(zIndex) + 100000;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === element) {
            active = true;
        }
    }

    function dragEnd(e) {
        console.log( trackMousePosition(this.id) )
        idtop = trackMousePosition(this.id);
        if(idtop!="") {
            this.style.zIndex = Number( document.querySelector("#"+idtop).style.zIndex ) +1;
        }else {
            this.style.zIndex = zIndex;
        }
        //console.log("termina")
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



/*
Extraer html, css y js de la pagina. Puede usarse despues de los drags y cambiar css en la pagina y html

const { html, css, js } = getPageSnapshot();
console.log('HTML:\n', html);
console.log('CSS:\n', css);
console.log('JavaScript:\n', js);
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
        const styles = element.getAttribute('style').split(';');
        styles.forEach(style => {
        if (style.trim() !== '') {
            const [property, value] = style.split(':');
            css += `  ${property.trim()}: ${value.trim()};\n`;
        }
        });
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
 * Ejemplo de uso
 * 
 * const modalHtml = `
    <h2>Mi Modal</h2>
    <p>Este es el contenido de mi modal.</p>
`;

const modalCss = `
    .modal h2 {
        color: blue;
    }
    .modal p {
        font-size: 16px;
    }
`;

createModal(modalHtml, modalCss, 400, 300, 100, 200, 'my-modal-id');
openModal('my-modal-id');
closeModal('my-modal-id');
destroyModal('my-modal-id');
 * 
 * Crea y agrega un elemento modal al DOM con la configuración proporcionada
 * @param {string} modalHtml - El HTML del contenido del modal
 * @param {string} modalCss - El CSS para el estilo del modal
 * @param {number} width - El ancho del modal
 * @param {number} height - El alto del modal
 * @param {number} top - La posición vertical del modal
 * @param {number} left - La posición horizontal del modal
 * @param {string} modalId - El ID del modal
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
 * Abre un modal existente
 * @param {string} modalId - El ID del modal a abrir
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
 * Cierra un modal existente
 * @param {string} modalId - El ID del modal a cerrar
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
 * Destruye un modal existente
 * @param {string} modalId - El ID del modal a destruir
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
 * Uso:
createSpinner('https://algo.gif', 50, 50, 'mySpinnerId');
openSpinner('mySpinnerId',10);
closeSpinner('mySpinnerId');

 * Crea un spinner y lo agrega al DOM con la configuración proporcionada
 * @param {string} spinnerImage - La URL de la imagen del spinner
 * @param {number} width - El ancho del spinner
 * @param {number} height - El alto del spinner
 * @param {string} spinnerId - El ID del spinner
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
   * Abre un spinner existente
   * @param {string} spinnerId - El ID del spinner a abrir
   * @param {number} spinSpeed - Velocidad del spinner
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
   * Cierra un spinner existente
   * @param {string} spinnerId - El ID del spinner a cerrar
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
   * Destruye un spinner existente
   * @param {string} spinnerId - El ID del spinner a destruir
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