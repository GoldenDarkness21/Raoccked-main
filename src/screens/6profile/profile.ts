import { getCurrentUserProfile, getFile } from '../../utils/firebase';
import { getPostsForCurrentUser } from '../../utils/firebase';
import UserSidebar, { SidebarAttribute, } from "../../components/left-bar/left-bar";
import BottomNavbar, { NavbarAttribute } from '../../components/bottomBar/BottomNavbar';

import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { appState, dispatch } from '../../store';

export interface UserProfile {
    uid: string;
    displayName?: string;
    avatarUrl?: string; 
    [key: string]: any; 
}

export interface UserPosts {
    name: '';
    image: '';
}

class Profile extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
    }

    async connectedCallback() {
        const urlImg = await getFile(appState.user.userId)
        this.render(urlImg);
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
            const userProfile: UserProfile = await getCurrentUserProfile();
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
    

    

    render(urlImg:any) {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
              <link rel="stylesheet" href="../src/screens/6profile/profile.css">
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
                            <img id="user-img" src=${urlImg} alt="User profile img" />
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
                    <bottom-navbar ${NavbarAttribute.activeIcon}="home"></bottom-navbar>
                    </div>
                    
                </div>
            `;
        }
    }
    
    
    
}

customElements.define('app-profile', Profile);
export default Profile;