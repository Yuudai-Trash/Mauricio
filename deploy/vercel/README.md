# Despliegue en Vercel

Publicado en **https://estadio-cero.vercel.app** (proyecto `estadio-cero`).

La cuenta de Vercel todavía no tiene GitHub conectado, así que no puede desplegar directamente desde el repo.
Por eso el despliegue sube solo `index.html` y este `vercel.json`, que reescribe `/js/*` y `/css/*`
hacia jsDelivr, fijado a un commit concreto de este repositorio (público).

Para publicar una versión nueva: cambiar el SHA en `vercel.json` por el del commit nuevo y volver a desplegar.

Alternativa recomendada: conectar GitHub en Vercel (Account Settings → Authentication → Login Connections)
y enlazar el proyecto a `Yuudai-Trash/Mauricio`; así cada push se despliega solo, usando el `vercel.json` de la raíz.
