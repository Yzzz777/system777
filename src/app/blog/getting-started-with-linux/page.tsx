"use client";

import BlogPost from "@/components/BlogPost";

export default function GettingStartedWithLinux() {
  return (
    <BlogPost
      title="Primeros Pasos con Linux: Guía Completa"
      category="Linux"
      author="System 777"
      date="2025-01-15"
      readTime="8 min"
      content={`
## ¿Qué es Linux?

Linux es un sistema operativo de código abierto basado en UNIX, creado por Linus Torvalds en 1991. A diferencia de Windows o macOS, Linux es gratuito, altamente personalizable y cuenta con una enorme comunidad de desarrolladores que contribuyen a su mejora continua.

Hoy en día, Linux domina en servidores (más del 90% de la infraestructura web), supercomputación, dispositivos IoT, y cada vez más en escritorios. Distribuciones como Ubuntu, Fedora, Arch Linux y Debian hacen que sea accesible para usuarios de todos los niveles.

## ¿Por qué aprender Linux?

- **Carrera profesional**: Los desarrolladores y administradores de sistemas Linux tienen alta demanda laboral.
- **Seguridad**: Linux es inherentemente más seguro que otros sistemas operativos gracias a su modelo de permisos y su comunidad activa de auditoría.
- **Servidores**: Casi todos los servidores del mundo ejecutan Linux, desde servidores web hasta bases de datos.
- **Contenedores y DevOps**: Docker, Kubernetes y herramientas modernas de CI/CD están diseñadas principalmente para Linux.
- **Costo**: Es completamente gratuito. Puedes instalar Linux en tantas máquinas como quieras sin pagar licencias.
- **Privacidad**: Linux no recopila datos personales como otros sistemas operativos comerciales.

## Instalación de Linux

### Opción 1: Dual Boot

El dual boot te permite tener Linux y Windows en la misma máquina. Al encender el computador, eliges qué sistema operativo quieres usar.

**Pasos para instalar Ubuntu en dual boot:**

1. **Descargar la ISO**: Ve a [ubuntu.com/download](https://ubuntu.com/download) y descarga la versión LTS (Long Term Support) más reciente.
2. **Crear USB booteable**: Usa herramientas como Rufus (Windows) o Etcher (multiplataforma) para crear un USB booteable con la ISO descargada.
3. **Reducir partición de Windows**: Abre el Administrador de Discos de Windows, selecciona la partición principal y reduce su tamaño para crear espacio libre (mínimo 30GB recomendado).
4. **Configurar BIOS/UEFI**: Reinicia tu computadora y entra al BIOS/UEFI (generalmente con F2, F12 o Del). Desactiva Secure Boot temporalmente y configura el USB como dispositivo de arranque principal.
5. **Instalar Ubuntu**: Arranca desde el USB, selecciona "Instalar Ubuntu" y elige la opción "Instalar junto a Windows" (Instalación alongside).
6. **Configurar GRUB**: El instalador configurará automáticamente el gestor de arranque GRUB para que puedas elegir entre Linux y Windows.

### Opción 2: Máquina Virtual (VM)

Si no quieres modificar tu sistema actual, una máquina virtual es la opción ideal.

**Instalación con VirtualBox:**

\`\`\`bash
# 1. Descargar e instalar VirtualBox desde virtualbox.org
# 2. Crear una nueva máquina virtual
#    - Tipo: Linux
#    - Versión: Ubuntu (64-bit)
#    - RAM: 4096 MB (mínimo recomendado)
#    - Disco virtual: 30 GB
# 3. Asignar la ISO como disco de arranque
# 4. Iniciar la VM y seguir el instalador
\`\`\`

**Recomendaciones para VM:**
- Asigna al menos 4GB de RAM para un rendimiento aceptable.
- Habilita la virtualización anidada si necesitas usar contenedores.
- Usa la carpeta compartida de VirtualBox para transferir archivos entre el host y la VM.
- Instala las Guest Additions para mejorar la resolución y el rendimiento.

## Comandos Básicos de Linux

### Navegación y exploración de archivos

\`\`\`bash
# Mostrar el directorio actual de trabajo
pwd

# Listar archivos y carpetas
ls          # Lista básica
ls -la      # Lista detallada con archivos ocultos
ls -lh      # Lista con tamaños legibles (KB, MB, GB)

# Cambiar de directorio
cd /home              # Ir al directorio home
cd ..                 # Subir un nivel
cd ~/Documentos       # Ir a la carpeta Documentos
cd -                  # Volver al directorio anterior
\`\`\`

### Crear, copiar, mover y eliminar

\`\`\`bash
# Crear directorios
mkdir mis_archivos
mkdir -p ruta/nueva/carpeta    # Crea todas las carpetas padre si no existen

# Crear archivos vacíos
touch archivo.txt
touch archivo1.txt archivo2.txt

# Copiar archivos
cp archivo.txt copia.txt
cp -r directorio/ copia_directorio/    # Copiar carpetas recursivamente

# Mover/renombrar archivos
mv archivo.txt /home/user/Documentos/
mv nombre_viejo.txt nombre_nuevo.txt    # Renombrar archivo

# Eliminar archivos y carpetas
rm archivo.txt
rm -r directorio/            # Eliminar carpeta y su contenido
rm -rf directorio_forzoso/   # Forzar eliminación (¡cuidado!)
\`\`\`

### Permisos y administración

\`\`\`bash
# Cambiar permisos de archivos
chmod 755 archivo.sh      # rw-r-xr-x (ejecutable)
chmod 644 archivo.txt     # rw-r--r-- (lectura para todos)
chmod +x script.sh        # Hacer ejecutable un script

# Sudo: ejecutar comandos como administrador
sudo apt update                    # Actualizar lista de paquetes
sudo apt upgrade                   # Actualizar todos los paquetes
sudo apt install nombre_paquete    # Instalar un paquete
sudo apt remove nombre_paquete     # Desinstalar un paquete
sudo apt autoremove                # Limpiar paquetes no utilizados

# Información del sistema
uname -a              # Información del kernel
df -h                 # Uso del disco
free -h               # Uso de memoria RAM
top                   # Monitor de procesos en tiempo real
htop                  # Monitor de procesos mejorado (instalar con: sudo apt install htop)
\`\`\`

## Jerarquía del Sistema de Archivos de Linux

Linux utiliza un sistema de archivos jerárquico en forma de árbol. Aquí está la estructura principal:

\`\`\`
/                    # Raíz del sistema de archivos
├── /bin             # Binarios esenciales del sistema
├── /boot            # Archivos de arranque (kernel, GRUB)
├── /dev             # Dispositivos (discos, teclados, etc.)
├── /etc             # Archivos de configuración del sistema
│   ├── /etc/hostname
│   ├── /etc/hosts
│   └── /etc/passwd
├── /home            # Directorios personales de los usuarios
│   └── tu_usuario/
│       ├── Documentos/
│       ├── Descargas/
│       └── .bashrc
├── /lib             # Bibliotecas compartidas
├── /mnt             # Puntos de montaje temporales
├── /opt             # Software de terceros
├── /proc            # Información del sistema de archivos virtual
├── /root            # Directorio home del usuario root
├── /sbin            # Binarios del sistema (solo root)
├── /tmp             # Archivos temporales
├── /usr             # Programas de usuarios
│   ├── /usr/bin     # Comandos de usuario
│   ├── /usr/lib     # Bibliotecas
│   └── /usr/local   # Software instalado localmente
└── /var             # Variables (logs, bases de datos, etc.)
    └── /var/log     # Archivos de registro
\`\`\`

**Práctica recomendada**: Nunca elimines archivos en directorios del sistema como \`/bin\`, \`/sbin\` o \`/lib\`. Si estás aprendiendo, trabaja siempre dentro de tu directorio home (\`/home/tu_usuario\`).

## Gestión de Paquetes con APT

En distribuciones basadas en Debian/Ubuntu, APT (Advanced Package Tool) es la herramienta principal para instalar y gestionar software.

\`\`\`bash
# Actualizar la información de paquetes disponibles
sudo apt update

# Actualizar todos los paquetes instalados
sudo apt upgrade

# Buscar un paquete específico
apt search nombre_paquete

# Ver información de un paquete
apt show nombre_paquete

# Instalar un paquete
sudo apt install firefox

# Desinstalar un paquete (mantiene la configuración)
sudo apt remove firefox

# Desinstalar completamente (incluye configuración)
sudo apt purge firefox

# Limpiar caché de paquetes descargados
sudo apt clean

# Buscar qué paquete proporciona un archivo específico
apt-file search /usr/bin/nombre_comando
\`\`\`

**Gestión en otras distribuciones:**
- **Fedora/RHEL/CentOS**: \`dnf install\` o \`yum install\`
- **Arch Linux**: \`pacman -S nombre_paquete\`
- **openSUSE**: \`zypper install nombre_paquete\`

## El Archivo .bashrc y Personalización

El archivo \`.bashrc\` en tu directorio home contiene configuraciones personalizadas para tu terminal. Puedes modificarlo para crear alias, funciones y personalizar tu prompt.

\`\`\`bash
# Editar tu .bashrc
nano ~/.bashrc

# Ejemplos útiles para agregar:
alias ll='ls -la'
alias update='sudo apt update && sudo apt upgrade -y'
alias grep='grep --color=auto'

# Después de editar, recargar los cambios
source ~/.bashrc
\`\`\`

## Recursos para Seguir Aprendiendo

- **The Linux Command Line** (libro gratuito de William Shotts) - thelinuxcommandline.com
- **Linux Journey** - linuxjourney.com (tutoriales interactivos)
- **OverTheWire: Bandit** - overthewire.org/wargames/bandit (aprende Linux a través de retos)
- **Ubuntu Community Help Wiki** - help.ubuntu.com

## Conclusión

Linux es una herramienta poderosa que todo desarrollador o entusiasta de la tecnología debería conocer. Con esta guía, tienes las bases para empezar tu camino en el mundo Linux. La clave es la práctica: instala una distribución, explora los comandos y no tengas miedo de cometer errores. ¡El mundo de Linux te espera!

Recuerda: en Linux, la documentación es tu mejor amigo. Casi todo comando tiene un manual ejecutable con \`man nombre_comando\`.
      `}
    />
  );
}
