import UserSidebar, { SidebarAttribute } from '../../components/left-bar/left-bar';
import BottomNavbar, { NavbarAttribute } from '../../components/bottomBar/BottomNavbar';
import { addObserver, appState, dispatch } from '../../store';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { upLoadFile,  updateUserData } from '../../utils/firebase';

const profileData = {
  name: '',
};

class Settings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    addObserver(this);
  }

  async connectedCallback() {
    const userId = appState.user.userId;
    console.log('ID del usuario:', userId);
    this.render();
  }

  

  changeScreen() {
    dispatch(navigate(Screens.PROFILE));
  }


  

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../src/screens/7settings/settings.css">
      <bottom-navbar ${NavbarAttribute.activeIcon}="home"></bottom-navbar>
        `
      ;
  
      // Contenedor principal
      const mainContainer = document.createElement('section');
      mainContainer.classList.add('maincontainer');

      // Barra lateral
      const sidebar = document.createElement('div');
      sidebar.id = 'sidebar';
      const userSidebar = document.createElement('user-sidebar');
      userSidebar.setAttribute(SidebarAttribute.profilePicture, '');
      sidebar.appendChild(userSidebar);
      mainContainer.appendChild(sidebar);

      // Contenedor del formulario
      const container = document.createElement('section');
      container.classList.add('edit-profile-container');
      mainContainer.appendChild(container);

      // Sección de perfil
      const profileSection = document.createElement('div');
      profileSection.classList.add('profile-section');
      container.appendChild(profileSection);

      // Sección del formulario
      const formSection = document.createElement('div');
      formSection.classList.add('form-section');
      container.appendChild(formSection);

      // Campo de la imagen
      const pImage = this.ownerDocument.createElement('input');
      pImage.type = 'file';
      pImage.addEventListener('change', async () => {
        const file = pImage.files?.[0];
        if (file) {
          await upLoadFile(file, appState.user.userId);
          alert('Foto de perfil actualizada.');
        }
      });
      formSection.appendChild(pImage);

      // Campo de nombre
      const nameLabel = document.createElement('label');
      nameLabel.innerText = 'User name';
      formSection.appendChild(nameLabel);

      const nameInput = document.createElement('input');
      nameInput.value = profileData.name;
      formSection.appendChild(nameInput);

      // Botón de guardar cambios
      const saveButton = document.createElement('button');
      saveButton.innerText = 'Save Changes';
      saveButton.classList.add('save-button');
      saveButton.addEventListener('click', async () => {
        const updatedName = nameInput.value;
        const userId = appState.user.userId;

        // Actualizar en Firebase
       await updateUserData (userId, updatedName)
      
        alert('Información actualizada exitosamente.');
        dispatch(navigate(Screens.PROFILE))
      });
      formSection.appendChild(saveButton);

      this.shadowRoot.appendChild(mainContainer);
    }
  }
}

customElements.define('app-settings', Settings);
