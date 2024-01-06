
  
# Proyecto NextSnkr

  El sistema es una aplicación web que tiene como función principal ordenar una lista de coleccionables en función de diferentes características que actúan como criterios de calificación. Estas características se utilizan para evaluar y clasificar los coleccionables, y luego se muestra al usuario la mejor opción según sus preferencias. En resumen, tu sistema ayuda a los usuarios a encontrar la mejor elección de coleccionables basándose en criterios específicos

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  <!-- [A deployed version can be viewed here.]() -->
  
---
## Contenido

1. [Acerca de](#acerca-de)
    1. [Framework](#framework)
    <!-- 2. [Historia de usuario](#user%20story) -->
    2. [Criterios de aceptación](#criterios-de-aceptación)
        
        2.1. [Autenticacion y Rutas protegidas](#autenticación-y-rutas-protegidas)

    <!-- 4. [Visuales](#visuals) -->
2. [Instalación](#instalación)
3. [Licencia](#license)
4. [Autor](#autor)

---
## Acerca de

### Framework

Se ha decidido usar el stack MERN, que por sus siglas incluye MongoDb, Express, React, Node Js.
Es un stack basado en Javascript, el cual usa una base de datos no relacional mediante MongoDb, un servidor de peticiones HTTP Express, para la parte del Frontend, se utiliza React para presentar una aplicación Web y Node Js como backend sobre el cual se montará el servidor.

A breves rasgos, el sistema tendrá la siguiente estructura:

![MERN Stack](https://sp-ao.shortpixel.ai/client/to_webp,q_lossy,ret_img,w_943/https://www.bocasay.com/wp-content/uploads/2020/03/MERN-stack-1.png)

Escalando a un nivel más bajo, el sistema sigue el siguiente esquema: 

![Esquema del sistema](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes/mvc_express.png)

El diagrama nos representa el flujo principal de los datos y partes que necesitamos implementar para manjear peticiones HTTP.<br>
Base de datos y modelos, estos modelos son los que definen la estructura de los datos que vamos a utilizar.<br>
Rutas, las cuales van a recibir las peticiones y transmitirlas al controlador correspondiente el cual se supone haga una función en específico.<br>
Controladores, funciones que van a realizar procesos específicos, se encargaran de enviar y recibir los datos a los modelos y a su vez a las vistas.<br>
Vistas, es donde se mostrarán los datos y será la interfaz que visualize el usuario. 

### Modelado

El sistema tendrá la siguiente estructura:

![Modelado](https://res.cloudinary.com/randymejiaarias/image/upload/v1704577464/ixxgs4rnqhwffkxwdxbf.jpg)

---

<!-- ### Historia de usuario - ¿Por qué se realiza el proyecto?
  

--- -->

### Criterios de aceptación
#### Autenticación y Rutas protegidas
La aplicación debe contar con un sistema de autentificación y rutas protegidas para evitar que un usuario no autorizado tenga acceso a ella. Para esto es muy importante contar con un apartado para Iniciar Sesión.

Diagrama de autenticación y rutas protegidas
![Diagrama de autenticación y rutas protegidas](https://danishshakeel.me/wp-content/uploads/2022/11/RouteGuard-768x365.png.webp)

El diagrama muestra como esta armada la arquitectura del módulo de autenticación, la aplicación responde a las distintas peticiones del usuario pasando en primer lugar por un middleware de autenticación en el cuál se verifica que el usuario tenga una sesión activa en el sistema, esta verificación se realiza mediante el uso de un token, en dicho token se guarda información del token y el tiempo de sesión activa, si este token es vigente entonces la aplicación entiende que hay una sesión activa para el usuario que esta intentando realizar la petición y le deja pasar para culminar la acción que está solicitando. <br>
En caso de no tener una sesión activa o no pasar el token, la aplicación no le dejara pasar y lo redireccionará a la pantalla de inicio de sesión.

  
### Explicación del core
El sistema está enfocado a proporcionar a los usuarios una plataforma para gestionar y tomar decisiones informadas sobre coleccionables, permitiendo a los usuarios administrar su colección de coleccionables, calificarlos y clasificarlos según sus criterios personalizados, y proporciona una manera conveniente de encontrar los coleccionables que mejor se adaptan a sus preferencias. Esto facilita a los entusiastas de coleccionables la toma de decisiones más informadas y la identificación de las mejores opciones disponibles en el mercado. El sistema ofrece las siguientes funciones:

#### •	Añadir Artículos a Tus Favoritos
Los usuarios pueden agregar coleccionables a una lista de "Favoritos" para realizar un seguimiento de los elementos que les interesan. Esta función permite a los usuarios mantener un registro de los coleccionables que están considerando adquirir o seguir de cerca.
#### •	Calificación y Clasificación Personalizada
Los usuarios pueden definir las características que desean utilizar para calificar los coleccionables. Pueden seleccionar entre una variedad de atributos o características específicas para cada coleccionable, como rareza, precio, demanda, entre otros. Además, los usuarios pueden asignar ponderaciones a estas características, lo que les permite indicar la importancia relativa de cada atributo en su decisión.
#### •	Ordenación y Clasificación
Una vez que los usuarios han calificado y ponderado las características, el sistema utiliza esta información para ordenar y clasificar los coleccionables en función de sus preferencias individuales. Los coleccionables se presentan en un orden que refleja su idoneidad de acuerdo con los criterios y ponderaciones proporcionados por el usuario.
#### •	Visualización de Resultados
El sistema muestra los coleccionables ordenados de acuerdo con las preferencias del usuario, lo que les permite identificar fácilmente las mejores opciones en función de su calificación personalizada. Esto ayuda a los usuarios a tomar decisiones más informadas y eficientes sobre qué coleccionables comprar o seguir.

La ventaja del sistema es que no se necesita cargar productos, ya que cuenta con funciones que realizan la carga automaticamente según las búsquedas que haga el usuario, ya que esta conectado directamente a 2 de las principales plataformas de reventa, las cuales servirán como repositorio de los productos y a su vez serán las que alimenten los datos del sistema.<br>
La clasificación de cada producto corre por cuenta de cada usuario ya que cada usuario es el que se encarga de establecer calificaciones según las caractisticas que considere importantes para él; por lo que una vez establecidos los valores de cada caracteristica, al agregar un nuevo producto a su seguimiento este calculará autmáticamente un valor como calificación general.

---
<!-- ## Visuales

  ![]()

--- -->

## Instalación:

1. Clonar el repositorio de Git

  Para clonar el repositorio usar el comando:
  
      git clone https://github.com/RandyMejiaArias/api-next-snkr
2. En la carpeta se creará un archivo llamado _`example.env`_, duplicarlo y cambiar su nombre a _`.env`_.
3. Cambiar los valores de las variables para que se ajuste a su entorno.
4. En una terminal dentro de la raíz del proyecto ejecutar el comando _`npm install`_ para instalar los paquetes.
5. Para continuar con el desarrollo o realizar modificaciones ejecute _`npm run dev`_.
6. El servidor se levantará automaticamente con cada cambio que se realice.
  
---
## Frontend
  El Frontend del proyecto se encuentra alojado en el siguiente [repositorio](https://github.com/RandyMejiaArias/webApp-next-snkr).<br>
  Es un sistema realizado en React el cual tiene conexión directa con el backend.

---

## License
  License used for this project - MIT
  * For more information on license types, please reference this website
  for additional licensing information - [https: //choosealicense.com/](https://choosealicense.com/).

---
<!-- 
## Contributing:
  
  To contribute to this application, create a pull request.
  Here are the steps needed for doing that:
  - Fork the repo
  - Create a feature branch (git checkout -b NAME-HERE)
  - Commit your new feature (git commit -m 'Add some feature')
  - Push your branch (git push)
  - Create a new Pull Request

  Following a code review, your feature will be merged.


---

## Tests:
  

--- -->

## Autor
  Randy Mejia Arias

---

## Información de Contacto:
* GitHub: randymejiaarias
* Email: randy.mejia@udla.edu.ec
  
