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

openModal(modalHtml, modalCss, 400, 300, 100, 200, 'my-modal');

// Cerrar el modal
//closeModal('my-modal');
 * 
 * Función para abrir un modal personalizado
 * @param {string} modalHtml - El HTML del contenido del modal
 * @param {string} modalCss - El CSS para el estilo del modal
 * @param {number} width - El ancho del modal
 * @param {number} height - El alto del modal
 * @param {number} top - La posición vertical del modal
 * @param {number} left - La posición horizontal del modal
 * @param {string} modalId - El ID del modal
 */
function openModal(modalHtml, modalCss, width, height, top, left, modalId) {
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

    // Agregar un fondo de pantalla oscuro y borroso
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

    // Agregar el modal y el fondo al documento
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

/**
 * Función para cerrar un modal
 * @param {string} modalId - El ID del modal a cerrar
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.querySelector('.modal-overlay');

    if (modal && overlay) {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    }
}