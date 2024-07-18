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
*/

function makeDraggable(elementId) {
    // Obtener el elemento a convertir en arrastrable
    const element = document.getElementById(elementId);
    element.style.cursor = 'move';
    //element.classList.add('draggable');

    // Variables para almacenar la posición del mouse
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let active = false;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('mouseup', dragEnd);
    element.addEventListener('mousemove', drag);

    function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === element) {
        active = true;
    }
    }

    function dragEnd(e) {
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
}



/*
Extraer html y css de la pagina.
*/
function getPageSnapshot() {
    // Obtener el HTML actual de la página
    let html = `\`\`\`html
  ${document.documentElement.outerHTML}
  \`\`\``;
  
    // Generar el CSS
    let css = `\`\`\`css
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
  
    // Eliminar el CSS inline del HTML
    html = html.replace(/<[^>]+style="[^"]*"[^>]*>/g, (match) => {
      return match.replace(/style="[^"]*"/g, '');
    });
  
    return { html, css };
  }