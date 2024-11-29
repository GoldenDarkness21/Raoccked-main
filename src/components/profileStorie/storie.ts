// Enum para los atributos que queremos mostrar
export enum StorieAttribute {
    'photo' = 'photo',
}

class Storie extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return Object.values(StorieAttribute);
    }

    attributeChangedCallback(propName: StorieAttribute, oldValue: string | undefined, newValue: string | undefined) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() { 
        this.render();   
    }

    render() {
        if (this.shadowRoot) {
            const photo = this.getAttribute(StorieAttribute.photo) || 'Not found';
            

            this.shadowRoot.innerHTML = `
              <link rel="stylesheet" href="../src/components/profileStorie/storie.css">
                <div id="photo">
                   <img id="img" src="${photo}">
                </div>
    
            `;
        }
    }

    
};

customElements.define('profile-storie', Storie);
export default Storie;
