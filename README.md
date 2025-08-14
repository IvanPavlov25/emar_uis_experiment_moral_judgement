# EMAR – UIS Experiment: Empatía y Juicio Moral

Proyecto de [oTree](https://www.otree.org/) para el Grupo EMAR – UIS. Implementa un juego económico con roles de negociadores, víctima y observador.

## Instalación

1. Crear un entorno virtual de Python 3.10+
2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   otree devserver
   ```

## Configuración

Editar `settings.py` para ajustar:
- `faculties`: lista de facultades disponibles.
- `treatment_mix`: mezcla de tratamientos (suma 1.0).
- `decision_timeout`, `rating_timeout` (opcionales, en segundos).

## Flujo de pantallas

```
Consentimiento y Facultad → Espera de grupo → Decisión de Negociadores → Resultados → Juicio moral (Víctima y Observador) → Fin
```

## Exportar datos

Usar el panel de administración de oTree para exportar CSV con decisiones, facultad, tratamiento, roles y tiempos.

## Pruebas manuales

Simular 8–12 participantes con distintas facultades para verificar:
- Formación correcta de grupos de 4 roles.
- Etiquetas de facultad visibles u ocultas según el tratamiento.
- Fallback cuando falta observador neutral (`observer_is_neutral=False`).

## Notas

No se recolecta información personal. Puede retirarse en cualquier momento cerrando la página.
