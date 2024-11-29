import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { dispatch } from "../../store";
import PostPopup from '../PostPopup/PostPopup';  

export enum NavbarAttribute {
    'activeIcon' = 'activeIcon',
}

class BottomNavbar extends HTMLElement {
    private postPopup: PostPopup | null = null; 
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return Object.values(NavbarAttribute);
    }


    attributeChangedCallback(propName: NavbarAttribute, oldValue: string | undefined, newValue: string | undefined) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        this.postPopup = document.querySelector('post-popup'); // Obtén el popup
    }

    changeScreen(screen: Screens) {
        dispatch(navigate(screen));
        this.closePopupIfNotDashboard(screen); // Cierra el popup si no es dashboard
    }

    closePopupIfNotDashboard(screen: Screens) {
        if (this.postPopup && screen !== Screens.DASHBOARD) {
            this.postPopup.close(); // Cierra el popup
        }
    }
    addEventListeners() {
        // Agregar listener para el botón de favoritos
        const favoritosButton = this.shadowRoot?.querySelector('#favoritos');
        if (favoritosButton) {
            favoritosButton.addEventListener('click', () => {
                this.changeScreen(Screens.FAVORITES);
            });
        }

        // Agregar listener para el botón de perfil
        const profileButton = this.shadowRoot?.querySelector('#profile');
        if (profileButton) {
            profileButton.addEventListener('click', () => {
                this.changeScreen(Screens.PROFILE);
            });
        }

        // Agregar listener para el botón de crear post
        const createPostButton = this.shadowRoot?.querySelector('#create-post');
        if (createPostButton) {
            createPostButton.addEventListener('click', () => {
                this.changeScreen(Screens.CREATEPOST);
            });
        }

        // Agregar listener para el botón de dashboard
        const homeButton = this.shadowRoot?.querySelector('#home');
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                this.changeScreen(Screens.DASHBOARD);
            });
        }
    }
    render() {
        if (this.shadowRoot) {
            const activeIcon = this.getAttribute(NavbarAttribute.activeIcon) || 'home';

            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="../src/components/bottomBar/BottomNavbar.css">
                <div class="navbar">
                       <button id="home" class="menu-item active">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </button>
                             <button id="create-post" class="menu-item">
                             <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
                                 <circle cx="12" cy="12" r="10"></circle>
                                 <line x1="12" y1="8" x2="12" y2="16"></line>
                                 <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </button>
                    <button class="menu-item ${activeIcon === 'search' ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                        <button id="profile" class="menu-item">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                </div>
            `;
        }
    }
}

customElements.define('bottom-navbar', BottomNavbar);
export default BottomNavbar;

