import { Post } from '../../types/post';

class PostPopup extends HTMLElement {
    private post: Post | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setPost(post: Post) {
        this.post = post;
        this.render();
    }

    close() {
        this.post = null;
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = ''; // Limpiar el contenido
        }
        this.style.display = 'none'; // Ocultar el popup
    }

    render() {
        if (this.shadowRoot && this.post) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/PostPopup/PostPopup.css">
                <div class="popup">
                    <div class="image-container">
                        <img src="${this.post.image}" alt="Image of ${this.post.name}">
                    </div>
                    <div class="content">
                        <h2>${this.post.name}</h2>
                        <p class="ingredients">Ingredients: <P>${this.post.ingredients}</p>
                        <p class="preparation">Preparation:<P> ${this.post.preparation}</p>
                        <div class="tags-container">
                        <p class="categorie">${this.post.categorie}</p>
                        <p class="time">${this.post.time}</p>
                        <p class="difficulty"> ${this.post.difficulty}</p>
                        </div>
                    </div>
                    <button id="close-button">X</button>
                </div>

            `;

            

            this.shadowRoot.getElementById('close-button')?.addEventListener('click', () => this.close());
        }
    }
}

customElements.define('post-popup', PostPopup);
export default PostPopup;



