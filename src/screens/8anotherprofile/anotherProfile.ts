import { getCurrentUserProfile } from '../../utils/firebase';
import { getPostsForCurrentUser } from '../../utils/firebase';
import UserSidebar, { SidebarAttribute, } from "../../components/left-bar/left-bar";
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { dispatch } from '../../store';

export interface Anotherprofile {
    uid: string;
    displayName?: string;
    avatarUrl?: string; 
    [key: string]: any; 
}

export interface UserPosts {
    name: '';
    image: '';
}

class UserProfile extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
    }

    connectedCallback() {
        this.render();
        this.loadUserProfile();
        this.loadUserPosts();
        this.addEventListeners(); 
    }
    

    //Manejo de los botones para redireccionar
    changeScreen(screen: Screens) {
        dispatch(navigate(screen));
    }

    addEventListeners() {

          // Agregar listener para el botón de crear post
          const createPostButton = this.shadowRoot?.querySelector('#new-post');
          if (createPostButton) {
              createPostButton.addEventListener('click', () => {
                  this.changeScreen(Screens.CREATEPOST);
              });
          }

        // Agregar listener para el botón de editar perfil
        const homeButton = this.shadowRoot?.querySelector('#edit');
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                this.changeScreen(Screens.SETTINGS);
            });
        }
  

    }



    async loadUserProfile() {
        try {
            const userProfile: Anotherprofile = await getCurrentUserProfile();
            console.log('User data:', userProfile);

            const userNameElement = this.shadowRoot?.querySelector('#user-name');
            const userAvatarElement = this.shadowRoot?.querySelector('#user-avatar');

            if (userNameElement) userNameElement.textContent = userProfile.displayName || 'Unknown name';
            if (userAvatarElement) userAvatarElement.setAttribute('src', userProfile.avatarUrl || 'default-avatar.png');
        } catch (error) {
            console.error('Error loading user profile:', error);
            window.location.href = '/login.html';
        }
    }

    async loadUserPosts() {
        try {
            const userPosts: any = await getPostsForCurrentUser(); // Obtiene los posts del usuario actual
        
            if (!Array.isArray(userPosts)) {
                console.error('Los posts del usuario no son un array:', userPosts);
                return;
            }
        
            const postsContainer = this.shadowRoot?.getElementById('posts-container');
            if (!postsContainer) {
                console.error('Contenedor de posts no encontrado');
                return;
            }
        
            postsContainer.innerHTML = ''; // Limpia el contenido previo del contenedor
            
            userPosts.forEach((post: any) => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                
                // Renderiza la imagen del post y el título
                const postImage = post.image || 'default-image.png'; // Cambia "image" por la propiedad correcta si es necesario
                const postName = post.name || 'Post sin nombre';
    
                postElement.innerHTML = `
                    <img src="${postImage}" alt="Post Image" class="recipe-image"/>
                    <h2 class="recipe-name">${postName}</h2>
                `;
                postsContainer.appendChild(postElement); // Agrega el post al contenedor
            });
        } catch (error) {
            console.error('Error cargando los posts del usuario:', error);
        }
    }
    

    

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
    .main-container {
        display: flex;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }


    .content {
        flex-grow: 1; /* Toma el resto del espacio disponible */
        padding: 3rem;
        background-color: #FCF6F6;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .profile-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .profile-info img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    #posts-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .post {
    flex: 1 1 calc(16.666% - 1rem); /* Seis columnas */
    max-width: calc(16.666% - 1rem); /* Seis columnas */
    border-radius: 0.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: transparent;
}

.recipe-name{
font-size: 1rem;
font-weight: 800;
}


    
    .recipe-image {
    width: 200px; /* Define un ancho específico */
    height: 250px; /* Define un alto específico */
    box-shadow: 0 0.125rem 0.52rem rgba(0, 0, 0.2, 0.3); 
    object-fit: cover; /* Hace que la imagen se recorte para llenar el contenedor */
    border-radius: 19px; /* Opcional: bordes redondeados */
}

      
.profile-info1{
    display: flex;
    gap: 5rem;
}

#actions {
    justify-content: center; /* Centra horizontalmente */
    align-items: center; 
    display: flex;
    gap: 5rem;
    margin-bottom: 2rem;
}

button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 11rem;
}

#edit {
    background-color: #FFC7BE;
    color: white;
}

#edit:hover {
    background-color: #F2ADA1;
}

#new-post {
    background-color: #EBEAEA;
    color: #7A7A7A;
}

#new-post:hover {
    background-color: #C8C8C8;
}
    .seguidores{
    font-size: 0.9rem;
    color: #7A7A7A;
    }

</style>

                <div class="main-container">

                    <div id="sidebar">
                        <user-sidebar ${SidebarAttribute.profilePicture}></user-sidebar>
                    </div>

                    <div class="content">

                        <div class="profile-info">

                            <div class="profile-info1">
                            <div id="lowered">
                                <h3>42.5k</h3>
                                <p class="seguidores">Followers</p>
                            </div> 
                            <img id="user-avatar" src="default-avatar.png" alt="User profile img" />
                                <div id="lowered">
                                    <h3>598</h3>
                                    <p class="seguidores">Following</p>
                                </div>
                             </div>

                            <h2 id="user-name">Loading...</h2>
                                <div id="actions">
                                    <button id="edit">Edit</button>
                                    <button id="new-post">New Post</button>
                                </div>
                        </div>

                        <div id="posts-container">
                            <p>Loading posts...</p>
                        </div>

                    </div>

                </div>
            `;
        }
    }
    
    
    
}

customElements.define('app-anotherprofile', UserProfile);
export default UserProfile;