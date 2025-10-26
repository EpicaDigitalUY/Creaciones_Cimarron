
const contenedorProductos = document.getElementById('products-grid');

let productCards = [];

fetch('./../json/productos.json') // recoje los datos 
    .then(response => response.json()) // los pasa JSON
    .then(data => {  //Cuando consigue los datos...
        if (data.lenght === 0) {
            contenedorProductos.innerHTML = '<p>Aún no hay productos aquí</p>' //Si no hay devuelve un p
        } else {
            data.forEach(producto => {  // si data no esta vacio, recorre la array
                console.log(data);

                
                
                const artProducto = document.createElement('article'); //Crea un elemento article 
                artProducto.classList.add('product-card'); //agrega la clase correspondiente
                artProducto.dataset.cat = producto.categoria;
                artProducto.dataset.name = producto.nombre;
                artProducto.dataset.desc = producto.descripcion;
                artProducto.dataset.tags = producto.tags.join(' ');

                artProducto.innerHTML = `
                   <a href="/${encodeURIComponent(producto.nombre)}/p/${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="product-info">
                        <h3 class="product-name">${producto.nombre}</h3>
                        <p class="product-desc">${producto.descripcion}</p>
                        <p class="product-price">$${producto.precio.toLocaleString()}</p>
                    </div>
                    </a>
                    `;
                contenedorProductos.appendChild(artProducto);
            });
            productCards = Array.from(document.querySelectorAll('.product-card'));


            // Store original text to support highlighting reset
            productCards.forEach(card => {
                const nameEl = card.querySelector('.product-name');
                const descEl = card.querySelector('.product-desc');
                if (nameEl) card.dataset.nameOriginal = nameEl.textContent;
                if (descEl) card.dataset.descOriginal = descEl.textContent;
            });

            applyFilters(); // Aplica filtros después de cargar productos
        }
    });

function debounce(fn, wait) {
    let t;
    return function () {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, arguments), wait);
    };
}



const searchInput = document.getElementById('catalog-search');
const clearBtn = document.getElementById('clear-search');
const catButtons = Array.from(document.querySelectorAll('.cat-btn'));
const productsGrid = document.getElementById('products-grid');
const resultCount = document.getElementById('result-count');

// Utilities
function normalizeText(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Active categories (empty = all)
function getActiveCategories() {
    const active = catButtons.filter(b => b.classList.contains('active')).map(b => b.dataset.cat);
    // if "all" active or none selected => treat as all
    if (active.length === 0 || active.includes('all')) return [];
    return active;
}

// Filtering logic: split search into tokens, require that each token appears somewhere in the product's searchable text
function matchesSearch(card, tokens) {
    if (tokens.length === 0) return true;
    const combined = (card.dataset.name + ' ' + (card.dataset.desc || '') + ' ' + (card.dataset.tags || '')).toLowerCase();
    const norm = normalizeText(combined);
    return tokens.every(t => norm.indexOf(normalizeText(t)) !== -1);
}

function highlightText(text, tokens) {
    if (!tokens.length) return text;
    let out = text;
    // Escape for regex
    tokens.forEach(tok => {
        const t = tok.trim();
        if (!t) return;
        const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(esc, 'ig');
        out = out.replace(rx, match => `<mark>${match}</mark>`);
    });
    return out;
}

function applyFilters() {
    const searchVal = searchInput.value.trim();
    const tokens = searchVal === '' ? [] : searchVal.split(/\s+/);
    const activeCats = getActiveCategories();

    let visibleCount = 0;

    productCards.forEach(card => {
        // category filter
        const cat = card.dataset.cat;
        const catMatches = (activeCats.length === 0) || activeCats.includes(cat);

        // search filter
        const searchMatches = matchesSearch(card, tokens);

        const shouldShow = catMatches && searchMatches;

        // reset highlight to original first
        const nameEl = card.querySelector('.product-name');
        const descEl = card.querySelector('.product-desc');
        if (nameEl && card.dataset.nameOriginal) nameEl.innerHTML = card.dataset.nameOriginal;
        if (descEl && card.dataset.descOriginal) descEl.innerHTML = card.dataset.descOriginal;

        if (shouldShow) {
            // highlight terms in name and desc
            if (tokens.length) {
                if (nameEl) nameEl.innerHTML = highlightText(nameEl.textContent, tokens);
                if (descEl) descEl.innerHTML = highlightText(descEl.textContent, tokens);
            }
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // If no results, show message
    if (visibleCount === 0) {
        if (!document.querySelector('.no-results')) {
            const msg = document.createElement('div');
            msg.className = 'no-results';
            msg.textContent = 'No se encontraron productos. Ajusta la búsqueda o filtros.';
            productsGrid.parentNode.appendChild(msg);
        }
    } else {
        const existing = document.querySelector('.no-results');
        if (existing) existing.remove();
    }

    resultCount.textContent = `Mostrando ${visibleCount} productos`;
}

// Events
catButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        // Toggle logic: clicking 'all' clears others; clicking a category toggles it and deactivates 'all'
        catButtons.forEach(b => b.classList.remove('active'));
        
            // remove 'all' active
            this.classList.toggle('active');
            // if none left active, default back to 'all'
            const anyActiveNonAll = catButtons.some(b => b.dataset.cat !== 'all' && b.classList.contains('active'));
            if (!anyActiveNonAll) {
                catButtons.forEach(b => b.classList.remove('active'));
                catButtons.find(b => b.dataset.cat === 'all').classList.add('active');
            }
        applyFilters();
    });
});

const debouncedApply = debounce(applyFilters, 180);
searchInput.addEventListener('input', debouncedApply);
clearBtn.addEventListener('click', function () {
    searchInput.value = '';
    searchInput.focus();
    applyFilters();
});

// initialize
// mark "all" as active at start
catButtons.forEach(b => { if (b.dataset.cat === 'all') b.classList.add('active'); });
applyFilters();