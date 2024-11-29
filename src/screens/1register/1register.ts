import { dispatch } from '../../store';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';
import { registerUser } from '../../utils/firebase';
import styles from './styles.css'; 

const credentials = {
	email: '',
	password: '',
	name: ' ',
};

class Register extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		// Crear y agregar el estilo
		const style = document.createElement('style');
		style.textContent = styles; // Asume que el CSS se está importando como una cadena
		this.shadowRoot?.appendChild(style);
	}

	connectedCallback() {
		this.render();
	}

	async changeScreen() {
        dispatch(navigate(Screens.LOGIN));
    }

	changeuName(e : any) {
		credentials.name = e.target.value;
	}

	changeEmail(e : any) {
		credentials.email = e.target.value;
	}

	changePassword(e : any) {
		credentials.password = e.target.value;
	}

	async submitForm() {
		const resp = await registerUser(credentials);
		resp ? dispatch(navigate(Screens.LOGIN)) : alert('No se pudo crear el usuario');
	}
	// Dentro de la función render()
	async render() {
		if (this.shadowRoot) {
			const section1 = this.ownerDocument.createElement('section');
			section1.classList.add('image-section');
			const section2 = this.ownerDocument.createElement('section');
			section2.classList.add('form-section');
			const section3 = this.ownerDocument.createElement('section'); 
			section3.classList.add('principal-section');


			const img = this.ownerDocument.createElement('img');
			section1.appendChild(img);
			img.classList.add('img-login');
	
			// Agregar la primera y segunda sección dentro de section3 y la 3 al shadowroot
			section3.appendChild(section1);
			section3.appendChild(section2);
			this.shadowRoot.appendChild(section3);
	
			// Crear contenedor para los botones
			const buttonContainer = this.ownerDocument.createElement('div');
			buttonContainer.classList.add('button-container');
	
			// Botón superior para ir al register
			const login = this.ownerDocument.createElement('button');
			login.innerText = 'Login';
			login.addEventListener('click', this.changeScreen);
			buttonContainer.appendChild(login);
			login.classList.add('login');
	
			// Botón superior para permanecer en la pantalla
			const signUp = this.ownerDocument.createElement('button');
			signUp.innerText = 'Sign up';
			buttonContainer.appendChild(signUp);            
			signUp.classList.add('signUp');
	
			// Agregar el contenedor de botones a la sección 2
			section2.appendChild(buttonContainer);
	
			// Título del formulario
			const title = this.ownerDocument.createElement('h1');
			title.innerText = 'Create an account';
			section2.appendChild(title);
			title.classList.add('title');
	
			// Campo de nombre
			const nameLabel = this.ownerDocument.createElement('label');
			nameLabel.innerText = 'User Name';
			section2.appendChild(nameLabel);
			nameLabel.classList.add('label'); // Agregar clase para estilos si es necesario
	
			const uName = this.ownerDocument.createElement('input');
			uName.placeholder = 'User Name';
			uName.addEventListener('change', this.changeuName);
			section2.appendChild(uName);
			uName.classList.add('formfield');
	
			// Campo de email
			const emailLabel = this.ownerDocument.createElement('label');
			emailLabel.innerText = 'Email';
			section2.appendChild(emailLabel);
			emailLabel.classList.add('label'); // Agregar clase para estilos si es necesario
	
			const uEmail = this.ownerDocument.createElement('input');
			uEmail.placeholder = 'Email';
			uEmail.addEventListener('change', this.changeEmail);
			section2.appendChild(uEmail);
			uEmail.classList.add('formfield');
	
			// Campo de contraseña
			const passwordLabel = this.ownerDocument.createElement('label');
			passwordLabel.innerText = 'Password';
			section2.appendChild(passwordLabel);
			passwordLabel.classList.add('label'); // Agregar clase para estilos si es necesario
	
			const password = this.ownerDocument.createElement('input');
			password.placeholder = 'Password';
			password.type = 'password'; // Aseguramos que el input sea de tipo password
			password.addEventListener('change', this.changePassword);
			section2.appendChild(password);
			password.classList.add('formfield');
	
			// Botón de registro
			const save = this.ownerDocument.createElement('button');
			save.innerText = 'Sign Up';
			save.addEventListener('click', this.submitForm);
			section2.appendChild(save);
			save.classList.add('save');
		}
	}
	
	

}

customElements.define('app-register', Register);
export default Register;
