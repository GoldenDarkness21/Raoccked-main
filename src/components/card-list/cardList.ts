import { Post } from "../../types/post";
import { addObserver, appState, dispatch } from "../../store";
import { getProductsAction } from "../../store/actions";
import { addLikeUser } from "../../utils/firebase";
import PostPopup from '../PostPopup/PostPopup';


const post: Post = {
    name: "",
    ingredients: "",
    preparation: "",
    categorie: "",
    time: "",
    difficulty: "",
    image: "",
    likes: {},
};

class CardList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        addObserver(this);
    }

    async connectedCallback() {
        console.log("appstate de carlist", appState);

        if (appState.posts.length === 0) {
            const action = await getProductsAction();
            console.log(action);
            dispatch(action);
        } else {
            this.render();
        }
        this.render();

        this.addHeartButtonListener(); 
    }

    async render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    .post {
    display: flex;
    flex-direction: column;
    border: 0.063rem solid #ddd; 
    border-radius: 1.25rem; 
    background-color: #f9f9f9;
    box-sizing: border-box;
    margin: 0.125rem; 
    flex: 0 1 12.5rem;  
    max-width: 15.625rem; 
    overflow: hidden;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0.1, 0.2); 
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 20rem; /* Altura fija para las cartas */
}

.post:hover {
    transform: translateY(-0.313rem); 
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2); 
}

.photo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 13rem; /* Altura fija para el contenedor de la imagen */
    overflow: hidden; /* Asegura que las imágenes no se salgan del contenedor */
}

.img {
    width: 100%;
    height: 100%; /* Asegura que la imagen ocupe toda la altura del contenedor */
    object-fit: cover; /* Asegura que la imagen mantenga su proporción */
    border-radius: 0.5rem 0.5rem 0 0; 
}

.info {
    background-color: white;
    padding: 1rem; 
    text-align: left;
    flex-grow: 1; /* Permite que el contenedor de info crezca */
}

.subtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.info h1 {
    font-size: 1rem;
    margin: 0;
    color: #333;
}

.info p {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
}

.heart-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.3s ease;
}

.heart-button svg {
    width: 1.5rem; 
    height: 1.5rem; 
    fill: none; 
    stroke: #ff9da6; 
    stroke-width: 0.125rem; 
    transition: fill 0.3s ease, stroke 0.3s ease;
}

.heart-button:hover {
    transform: scale(1.1);
}

.amountlikes{
    margin-left: 3.5rem;
}

@media screen and (max-width: 26.875rem) {
    .post {
        width: 11.25rem; 
    }
}
                </style>
            `;


            
            // Renderizar las tarjetas de posts
            appState.posts?.forEach((post: any) => {
                post.likes = Array.isArray(post.likes) ? post.likes : [];



                const maincontainer = this.ownerDocument.createElement("section");
                maincontainer.classList.add("post");

                const photocontainer = this.ownerDocument.createElement("section");
                photocontainer.classList.add("photo");


                const infocontainer = this.ownerDocument.createElement("section");
                infocontainer.classList.add("info");

                const titlecontainer = this.ownerDocument.createElement("section");
                titlecontainer.classList.add("title");

                const subtitlecontainer = this.ownerDocument.createElement("section");
                subtitlecontainer.classList.add("subtitle");

                const image = this.ownerDocument.createElement("img");
                image.src = post.image; // Asigna la URL de la imagen
                photocontainer.appendChild(image);
                image.classList.add("img");

                const name = this.ownerDocument.createElement("h1");
                name.innerText = post.name;
                titlecontainer.appendChild(name);

                const autor = this.ownerDocument.createElement("p");
                autor.innerHTML = post.userName;
                subtitlecontainer.appendChild(autor);

                // Agregar evento de clic para abrir el popup
                photocontainer.addEventListener('click', () => this.openPopup(post));
                // Agregar evento de clic para abrir el popup
                titlecontainer.addEventListener('click', () => this.openPopup(post));

                // Botón de corazón
				const heartButton = this.ownerDocument.createElement("button");
				heartButton.classList.add("heart-button");
				heartButton.id = `btn-heart-${post.name}`
				heartButton.innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
						<path class="heart-outline" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#ff9da6" stroke-width="2"/>
					</svg>
                `;

                heartButton.classList.toggle("filled");
					const path = heartButton.querySelector(".heart-outline");

					let userLiked = false

					if(post.likes.length > 0 && post.likes){
						userLiked = post.likes.includes(appState.user.userId);
						console.log('validation', userLiked);
					}

					// Cambiar la apariencia del botón en función de si el usuario dio like
					if (userLiked) {
						console.log('post kidep by meeee'
						);
						
						heartButton.classList.add("filled");
						if (path) {
							path.setAttribute("fill", "#ff9da6"); // Relleno rosado
							path.setAttribute("stroke", "#ff9da6"); // Borde rosado
						}
					} else {
						heartButton.classList.remove("filled");
						if (path) {
							path.setAttribute("fill", "none"); // Sin relleno
							path.setAttribute("stroke", "#ff9da6"); // Borde rosado
						}
					}

				const amountLikes = this.ownerDocument.createElement("p");
				amountLikes.innerHTML = post.likes.length || 0;
				subtitlecontainer.appendChild(amountLikes);
				amountLikes.classList.add("amountlikes");


				heartButton.addEventListener("click", () => {
					console.log('click', heartButton.id);
					console.log('like in post', post.uid);

					if (post.uid) {
						addLikeUser(post.uid);
					} else {
						console.error("El post no tiene un UID válido");
					}
				
				});

                subtitlecontainer.appendChild(heartButton);
                infocontainer.appendChild(titlecontainer);
                infocontainer.appendChild(subtitlecontainer);
                maincontainer.appendChild(photocontainer);
                maincontainer.appendChild(infocontainer);
                this.shadowRoot?.appendChild(maincontainer);
            });
        }
    }

    openPopup(post: Post) {
        console.log("Post en popup:", post);
        const popup = this.ownerDocument.createElement('post-popup') as PostPopup;
        
        // Verifica que 'popup' es una instancia de PostPopup antes de llamar a setPost
        if (popup instanceof PostPopup) {
            popup.setPost(post);
            popup.style.display = 'block'; // Asegura que el popup sea visible
            this.ownerDocument.body.appendChild(popup); // Agregar el popup al body
        } else {
            console.error('No se pudo crear una instancia válida de PostPopup');
        }
    }

    addHeartButtonListener() {
        // Busca todos los botones de corazón en el Shadow DOM y agrega listeners de clic
        const heartButtons = this.shadowRoot?.querySelectorAll(".heart-button");
        heartButtons?.forEach((button) => {
            button.addEventListener("click", () => {
                console.log("Botón de corazón clicado");
            });
        });
    }
}

customElements.define("card-list", CardList);
export default CardList;


