 import Post, { Attribute } from '../components/card/card';
import UserSidebar, { SidebarAttribute } from '../components/left-bar/left-bar';
import BottomNavbar, { NavbarAttribute } from '../components/bottomBar/BottomNavbar'; 
import '../../components/card-list/cardList';


class Favorites extends HTMLElement {
    recipesList: Post[] = [];
    storiesList: HTMLElement[] = []; 

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });


       
    }

    async connectedCallback() {
        this.render()
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = ` 
                <link rel="stylesheet" href="../src/styles.css">
                <div id="main-container">
                    <div id="sidebar">
                        <user-sidebar ${SidebarAttribute.profilePicture}></user-sidebar>
                    </div>
                    <div id="content">
                        
                        <div id="post">
                            <div id="component-post"></div>
                            <card-list  id="component-post"></card-list>
                        </div>
                    </div>
                    
                    <bottom-navbar ${NavbarAttribute.activeIcon}="home"></bottom-navbar>
                </div>
            `;
    
    
        }
    }
}    

customElements.define('app-favorites', Favorites);
export default Favorites;
