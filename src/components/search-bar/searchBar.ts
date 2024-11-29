// Enum para los atributos que queremos manejar en el componente de búsqueda
export enum SearchAttribute {
    'placeholder' = 'placeholder', // para personalizar el texto en el input
}

class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });  // Adjuntar Shadow DOM
    }

    static get observedAttributes() {
        return Object.values(SearchAttribute); // Atributos observados para el componente
    }

    attributeChangedCallback(propName: SearchAttribute, oldValue: string | undefined, newValue: string | undefined) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();  // Renderiza la barra de búsqueda
    }

    render() {
        if (this.shadowRoot) {
            const placeholder = this.getAttribute(SearchAttribute.placeholder) || 'Search...';
    
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="../src/components/search-bar/styles.css">
                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="${placeholder}">
                    <button class="search-button">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
                             <circle cx="11" cy="11" r="8"></circle>
                             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                         </svg>
                        </button>
                </div>
            `;
        }
    }
    
}

// Definir el nuevo custom element
customElements.define('search-bar', SearchBar);
export default SearchBar;
