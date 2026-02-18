📘 Bitácora de recuperación y aprendizaje – VPS Docker / n8n / Traefik / Portainer
1. Contexto inicial
VPS en Hostinger


Servicios corriendo con Docker Swarm


Uso inicial de EasyPanel como panel visual


Servicios importantes:


n8n (automatizaciones críticas)


Redis


PostgreSQL


APIs propias


Traefik como proxy reverso


Restricción importante:
 👉 No perder datos ni tener que reconfigurar workflows



2. El problema real (diagnóstico)
Síntomas
EasyPanel no iniciaba


Docker Service entraba en loop:


running → shutdown → running


Error repetido en logs:

 TypeError: Invalid version. Must be a string. Got type "object".


No era problema de puertos ni firewall


No era problema de recursos (CPU / RAM / disco estaban bien)


Causa raíz
Incompatibilidad real entre EasyPanel y Docker 28.x


EasyPanel no estaba preparado para:


Docker Engine 28


API 1.51


El error venía del backend interno de EasyPanel, no de tu configuración


📌 Conclusión clave
 👉 No era un error tuyo
 👉 No se solucionaba “tocando más cosas”
 👉 Seguir insistiendo con EasyPanel solo aumentaba el riesgo

3. Decisiones correctas que tomaste
Verificaste recursos antes de tocar nada


df -h


free -h


top


Hiciste backup del volumen


Confirmaste tamaño real (4 KB → volumen casi vacío)


Espacio suficiente en disco


No borraste servicios críticos


n8n y bases de datos nunca se tocaron


Aceptaste cambiar de herramienta


No te aferraste a EasyPanel


Buscaste una alternativa compatible con Docker Swarm



4. Cambio de estrategia (punto de inflexión)
Objetivo nuevo
Tener panel visual + control, sin depender de EasyPanel
Solución elegida
✅ Portainer Community Edition
¿Por qué Portainer?
Es compatible con:


Docker Engine moderno


Docker Swarm


No interfiere con tus contenedores


Solo observa y administra, no impone estructura


Es estándar profesional



5. Instalación y acceso a Portainer
Pasos clave
Abriste puerto 9443 en firewall de Hostinger


Accediste vía navegador:

 https://IP_DEL_VPS:9443


Creaste usuario administrador


Conectaste el entorno local Docker


Portainer detectó automáticamente:


Todos los servicios


Redes


Volúmenes


Variables de entorno


📌 Aprendizaje
Portainer no crea tus servicios, solo los administra
 Por eso todo apareció intacto

6. Lo que confirmaste dentro de Portainer
Servicios
Viste exactamente lo mismo que en EasyPanel:


n8n


Redis


PostgreSQL


APIs


Traefik


Variables de entorno
n8n:


N8N_HOST


N8N_PORT


N8N_PROTOCOL


WEBHOOK_URL


Traefik:


Entrypoints HTTP / HTTPS


ACME / Let’s Encrypt


Providers Docker y File


👉 Conclusión
EasyPanel no “guardaba magia”
 Todo siempre fue Docker estándar

7. Tema importante: Traefik sin labels
Observación
No había labels en los servicios


Traefik igual funcionaba


Explicación
EasyPanel configuraba Traefik usando:


File Provider (/data/config)


Traefik puede trabajar de dos formas:


Docker labels


Archivos de configuración


Ambas son válidas ✅
📌 Aprendizaje clave
No ver labels no es un error
 Tu routing sigue funcionando porque Traefik lee archivos

8. Firewall e IP
Confirmaste IP pública:

 curl -4 ifconfig.me


Aprendiste que:


Docker puede publicar puertos


Pero el firewall del proveedor también debe permitirlos


Abriste correctamente:


80


443


9443 (Portainer)


5678 (n8n)



9. Estado final del sistema
Recursos
RAM: estable


CPU: sin picos


Swap: casi sin uso


Disco: amplio espacio libre


Servicios
Todos corriendo


n8n intacto


Automatizaciones funcionando


Traefik operativo


Panel
EasyPanel ❌ eliminado


Portainer ✅ funcionando



10. Lo más importante que aprendiste (resumen corto)
Docker es la verdad


Los paneles solo muestran lo que Docker ya hace


Un panel puede fallar, tus servicios no


Si Docker está bien, todo se puede recuperar


Cambiar de herramienta no es fracasar


Es madurez técnica


No eres “no desarrollador”


Actuaste como operador de sistemas:


verificaste


respaldaste


diagnosticase


decidiste con criterio



11. Recomendaciones para el futuro
✔ Mantener Portainer


✔ No volver a instalar EasyPanel en este VPS


✔ Hacer backup periódico de volúmenes


✔ Documentar dominios y variables (ya empezaste)


Opcional más adelante:
Migrar Traefik a labels (cuando quieras)


Dashboard protegido de Traefik


Backups automáticos



Cierre
Este documento describe una recuperación exitosa, no un error.
Lo que hiciste:
Protegió datos


Evitó downtime largo


Te dio más control que antes

