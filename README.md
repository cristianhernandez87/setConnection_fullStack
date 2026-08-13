¿Cómo llegamos a planearlo así y cuáles son las metas del proyecto? La concepción de este proyecto nació de una estrategia de ingeniería muy clara: fusionar el rigor técnico de un sistema de nivel industrial con una pasión genuina por la música independiente y la cultura club. No queríamos construir el típico CRUD escolar, sino un producto real, robusto y escalable capaz de demostrar competencias de nivel Senior Full-Stack y arquitectura de software. Para lograrlo, estructuramos un desarrollo modular y metódico basado en Sprints: partimos de una infraestructura totalmente dockerizada con PostgreSQL, Redis y MinIO (almacenamiento S3 local), implementamos patrones de diseño avanzados como el Strategy Pattern para desacoplar el hardware de almacenamiento, y diseñamos un backend con NestJS que delega las tareas pesadas a colas de mensajes distribuidas con BullMQ, evitando cualquier bloqueo en el hilo principal de Node.js.

Nuestras metas principales son dos: a nivel de producto, ofrecer la experiencia definitiva de descubrimiento musical para amantes de la electrónica; y a nivel profesional, consolidar una pieza de ingeniería de élite que sirva como carta de presentación indiscutible para demostrar dominio técnico en desarrollo de software moderno, concurrencia, bases de datos relacionales profundas y interfaces reactivas de vanguardia (Angular con Signals y Web Audio API).



# setConnection_fullStack### 1. Backend de Alto Rendimiento (**NestJS & Node.js**)
* **Procesamiento Concurrente y Asíncrono:** Para evitar que un archivo de audio masivo bloquee el hilo principal de Node.js, implementamos un sistema orientado a eventos con **Redis** y colas de trabajo distribuidas con **BullMQ**. Las respuestas HTTP de subida vuelven en milisegundos mientras el "cerebro" procesa en background.
* **Patrones de Diseño (Strategy Pattern):** El módulo de almacenamiento está desacoplado mediante interfaces, permitiendo alternar de forma transparente entre un entorno local (**MinIO**) y producción en la nube (**AWS S3**).
* **Seguridad Defensiva y Tipado Estricto:** DTOs robustos con validaciones estrictas en la frontera de la API, previniendo inyecciones y garantizando la integridad de los datos antes de tocar la persistencia.

### 2. Base de Datos Relacional de Múltiples Niveles (**PostgreSQL & TypeORM**)
Un modelo relacional profundo que estructura lógicamente la música:
* **`sets`**: La entidad madre que almacena metadatos, tamaños en `bigint`, estados de procesamiento y referencias al almacenamiento.
* **`track_markers`**: Relación jerárquica en cascada que almacena los timestamps de inicio, duración y niveles de confianza de la IA.
* **`track_sources`**: Enlaces directos a plataformas de terceros para la monetización y exportación.

### 3. Experiencia de Usuario de Vanguardia (**Angular 18+**)
* **Signals Reactivos:** Gestión de estado ultra-eficiente sin la sobrecarga de librerías externas pesadas.
* **Reproductor Global Persistente (Singleton):** Arquitectura de audio basada en la **Web Audio API** y HTML5 Canvas, asegurando que la música **nunca se corte** aunque el usuario navegue por todo el panel de control.
* **Diseño Editorial Minimalista:** Estética oscura, contenedores con `backdrop-blur`, tipografías de impacto y transiciones fluidas.

---

## 🛠️ Ecosistema y Servicios Dockerizados

El proyecto viene completamente empaquetado para correr en cualquier máquina con paridad exacta con producción:
* **PostgreSQL:** Base de datos relacional transaccional.
* **Redis:** Broker de mensajes y motor en memoria para colas de trabajo pesadas.
* **MinIO:** Servidor de objetos compatible con la API S3 y consola web de administración.

---

## 🗺️ Hoja de Ruta (Roadmap de Desarrollo)

* ✅ **Sprint 1 (Cimientos y Persistencia):** Infraestructura en Docker, TypeORM, validadores de archivos y conexión exitosa con MinIO + Postgres.
* ✅ **Sprint 2 (El Cerebro Asíncrono):** Configuración de Redis, colas con BullMQ y workers de procesamiento en segundo plano.
* ✅ **Sprint 3 (Integraciones y OAuth):** Patrón Strategy de almacenamiento y flujos de autenticación externa para exportación de playlists.
* ✅ **Sprint 4 & 5 (Interfaz y WebSockets):** Subida multipart con barra de progreso en tiempo real impulsada por WebSockets (`Socket.io`).
* ✅ **Sprint 6 & 7 (Reproductor Avanzado y UX):** Integración de la Web Audio API, Canvas Waveform interactivo y autenticación JWT con Guards.

---
