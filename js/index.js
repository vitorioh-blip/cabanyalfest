'use strict';

// seccion intro zoom

const imgThumb = document.querySelector('.zoom-container img');
let overlay, imgFull, closeBtn;

imgThumb.addEventListener('click', () => {
  // Crear overlay
  overlay = document.createElement('div');
  overlay.classList.add('image-overlay');

  // Imagen ampliada
  imgFull = document.createElement('img');
  imgFull.src = imgThumb.src;
  overlay.appendChild(imgFull);

  // Botón cerrar
  closeBtn = document.createElement('button');
  closeBtn.classList.add('close-zoom');
  closeBtn.textContent = '×';
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Cerrar overlay
  closeBtn.addEventListener('click', () => overlay.remove());

  // Variables
  let isDragging = false,
      startX = 0, startY = 0,
      moveX = 0, moveY = 0,
      zoom = 3,
      minZoom = 1,
      maxZoom = 8;

  const imgState = { x: 0, y: 0, scale: zoom };

   
  overlay.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    overlay.style.cursor = 'grabbing';
  });

  overlay.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    overlay.style.cursor = 'grab';
  });

  //  ZOOM scroll centrado en el cursor 
  overlay.addEventListener('wheel', (e) => {
    e.preventDefault();

    const rect = imgFull.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const prevZoom = zoom;

    // Ajustar zoom
    if (e.deltaY < 0) zoom *= 1.1; // acercar
    else zoom /= 1.1; // alejar
    zoom = Math.min(Math.max(zoom, minZoom), maxZoom);

    // Mantener el punto del cursor estable
    const zoomRatio = zoom / prevZoom;
    moveX -= (offsetX - rect.width / 2) * (zoomRatio - 1);
    moveY -= (offsetY - rect.height / 2) * (zoomRatio - 1);

    updateTransform();
  }, { passive: false });

  // ZOOM táctil 
  let initialDistance = 0;
  overlay.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches);
    } else if (e.touches.length === 1) {
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX - moveX;
      startY = touch.clientY - moveY;
    }
  });

  overlay.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const newDistance = getDistance(e.touches);
      const delta = newDistance - initialDistance;
      const prevZoom = zoom;
      zoom += delta * 0.005;
      zoom = Math.min(Math.max(zoom, minZoom), maxZoom);
      initialDistance = newDistance;
      const zoomRatio = zoom / prevZoom;
      moveX *= zoomRatio;
      moveY *= zoomRatio;
      updateTransform();
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      moveX = touch.clientX - startX;
      moveY = touch.clientY - startY;
      updateTransform();
    }
  }, { passive: false });

  overlay.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Funciones auxiliares
  function getDistance(touches) {
    const [a, b] = touches;
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }

  function updateTransform() {
    imgFull.style.transform = `translate(${moveX}px, ${moveY}px) scale(${zoom})`;
  }

  updateTransform();
});


// Parallax edificio palmeras 

const titulo = document.querySelector('.titulo')
const palma01 = document.querySelector('.palma01')
const palma02 = document.querySelector('.palma02')
const mascleta = document.querySelector('.mascleta')
const noche02 = document.querySelector('.noche02')
const casas = document.querySelector('.casas')

document.addEventListener('scroll', function () {
  let value = window.scrollY
  // console.log(value)
  titulo.style.marginTop = value * 2.3 + 'px'

  palma01.style.marginLeft = -value + 'px'
  palma02.style.marginLeft = value + 'px'

  casas.style.marginBottom = -value + 'px'

  mascleta.style.marginBottom = -value * 1.1 + 'px'
  noche02.style.marginBottom = -value * 1.2 + 'px'
})



// Draggable stickers 

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cabanyal-section');
  const stickers = document.querySelectorAll('.draggable');

  stickers.forEach(sticker => {
    let isDragging = false;
    let offsetX, offsetY;

    // Al hacer clic
    sticker.addEventListener('mousedown', (e) => {
      isDragging = true;
      
      const rect = sticker.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      sticker.style.cursor = 'grabbing';
      sticker.style.zIndex = '1000'; 
      e.preventDefault(); 
    });

    // Mover el sticker
    const onMouseMove = (e) => {
      if (!isDragging) return;

      requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        let left = e.clientX - offsetX - containerRect.left;
        let top = e.clientY - offsetY - containerRect.top;

        // Opcional: limitar dentro de la sección
        // const maxX = containerRect.width - sticker.offsetWidth;
        // const maxY = containerRect.height - sticker.offsetHeight;
        // left = Math.max(0, Math.min(left, maxX));
        // top = Math.max(0, Math.min(top, maxY));

        sticker.style.left = `${left}px`;
        sticker.style.top = `${top}px`;
      });
    };

    // Soltar
    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        sticker.style.cursor = 'grab';
        sticker.style.zIndex = '10';
      }
    };

    // arrastrar el sticker

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });
});


// Galería dinámica

let pasoActual = 1;

function nextCard() {
  const actual = document.getElementById(`card-${pasoActual}`);
  const siguiente = document.getElementById(`card-${pasoActual + 1}`);
  const siguiente2 = document.getElementById(`card-${pasoActual + 2}`);
  const anterior = document.getElementById(`card-${pasoActual - 1}`);
  const indicadores = document.querySelectorAll('.indicador');

  pasoActual++;
  indicadores.forEach(i => i.classList.remove('indicador--activo'));

  if (actual) {
    actual.classList.remove('tarjeta--activa');
    actual.classList.add('tarjeta--anterior');
  }

  if (siguiente) {
    const dots = siguiente.querySelectorAll('.indicador');
    if (dots.length > pasoActual - 1) {
      dots[pasoActual - 1].classList.add('indicador--activo');
    }
    siguiente.classList.remove('tarjeta--siguiente');
    siguiente.classList.add('tarjeta--activa');
  }

  if (siguiente2) {
    siguiente2.classList.remove('tarjeta--siguiente2');
    siguiente2.classList.add('tarjeta--siguiente');
  }

  if (anterior) {
    anterior.classList.remove('tarjeta--anterior');
    anterior.classList.add('tarjeta--anterior2');
    document.getElementById('zona-siguiente')?.classList.add('oculto');
  }
  document.getElementById('zona-anterior')?.classList.remove('oculto');
}

function previousCard() {
  const actual = document.getElementById(`card-${pasoActual}`);
  const siguiente = document.getElementById(`card-${pasoActual + 1}`);
  const anterior = document.getElementById(`card-${pasoActual - 1}`);
  const anterior2 = document.getElementById(`card-${pasoActual - 2}`);
  const indicadores = document.querySelectorAll('.indicador');

  pasoActual--;
  indicadores.forEach(i => i.classList.remove('indicador--activo'));

  if (actual) {
    actual.classList.remove('tarjeta--activa');
    actual.classList.add('tarjeta--siguiente');
  }

  if (anterior) {
    const dots = anterior.querySelectorAll('.indicador');
    if (dots.length > pasoActual - 1) {
      dots[pasoActual - 1].classList.add('indicador--activo');
    }
    anterior.classList.remove('tarjeta--anterior');
    anterior.classList.add('tarjeta--activa');
  }

  if (anterior2) {
    anterior2.classList.remove('tarjeta--anterior2');
    anterior2.classList.add('tarjeta--anterior');
  }

  if (siguiente) {
    siguiente.classList.remove('tarjeta--siguiente');
    siguiente.classList.add('tarjeta--siguiente2');
    document.getElementById('zona-anterior')?.classList.add('oculto');
  }
  document.getElementById('zona-siguiente')?.classList.remove('oculto');
}

// táctiles 
let toqueInicialX = 0;

function onTouchStart(event) {
  toqueInicialX = event.changedTouches[0].clientX;
}

function onTouchEnd(event) {
  const toqueFinalX = event.changedTouches[0].clientX;
  const desplazamiento = toqueInicialX - toqueFinalX;
  const siguiente = document.getElementById(`card-${pasoActual + 1}`);
  const anterior = document.getElementById(`card-${pasoActual - 1}`);

  if (desplazamiento > 50 && siguiente) nextCard();
  else if (desplazamiento < -50 && anterior) previousCard();
}

// Asignar eventos táctiles al cargar 

document.addEventListener('DOMContentLoaded', () => {
  const tarjetas = document.querySelectorAll('.tarjeta');
  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('touchstart', onTouchStart);
    tarjeta.addEventListener('touchend', onTouchEnd);
  });

  // También hacer clic en zonas transparentes
  document.getElementById('zona-anterior')?.addEventListener('click', previousCard);
  document.getElementById('zona-siguiente')?.addEventListener('click', nextCard);
});


//  Botón Hamburguesa 
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});

// Cierra el menú al hacer clic en un enlace
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  });
});