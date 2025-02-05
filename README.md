# AGENDA FINAL - SEMANA 7-8

## Francis Fiallos

Este proyecto tiene como objetivo la creación de un sistema básico de gestión de usuarios y contactos, que incluye registro, inicio de sesión, recuperación de contraseña, edición de perfil y administración de contactos. A continuación, se describen los puntos principales implementados.

---

## **Tecnologías Utilizadas**
- **Backend:** PHP con MySQL para la gestión de datos.
- **Frontend:** Angular e Ionic para el desarrollo de la interfaz de usuario.

---

## Funcionalidades Principales

### **Gestión de Usuarios**

#### **Registro de Usuarios (Crear Cuenta)**
- **Validación de formulario:**
  - Cédula no repetida (verificación contra la base de datos o un repositorio de usuarios).
  - Confirmación de contraseña (comparación de los campos `password` y `confirmPassword`).
  - Solo se permite la creación de la cuenta si todos los campos están validados correctamente.

#### **Inicio de Sesión**
- Se verifica la combinación de cédula y contraseña.
- Si el usuario ingresa datos incorrectos, tiene un máximo de **3 intentos**.
- Al superar los **3 intentos fallidos**, la cuenta se bloquea temporalmente por un periodo de tiempo definido, impidiendo más intentos de inicio de sesión.

#### **Recuperación de Contraseña**
- Se implementa un mecanismo de recuperación de la contraseña mediante **correo electrónico**.
- El usuario recibe un enlace para restablecer su contraseña siguiendo el proceso definido.

#### **Menú Hamburguesa**
- Una vez autenticado, se muestra un menú tipo **hamburguesa** que incluye:
  - Nombre del usuario (obtenido al momento de la sesión).
  - Acceso a la gestión de contactos.
  - Opción de cerrar sesión.

---

## **Gestión de Contactos**

### **Visualización de Contactos**
- Se muestra una lista de todos los contactos del usuario.
- Cada contacto contiene:
  - **Nombre**
  - **Apellido**
  - **Número de teléfono**
  - **Correo electrónico**

### **Agregar Contacto**
- Se permite añadir nuevos contactos.
- **Restricción:** No se permite la duplicidad de números de teléfono.

### **Editar Contacto**
- Posibilidad de modificar los datos de un contacto existente.

### **Eliminar Contacto**
- Se muestra una **confirmación antes de eliminar** un contacto para evitar eliminaciones accidentales.

---

Este sistema proporciona una gestión sencilla y eficiente de usuarios y contactos, asegurando la seguridad en el acceso y la integridad de los datos.
