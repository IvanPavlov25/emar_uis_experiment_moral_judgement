# settings.py (oTree 5.x)
from os import environ

# --- Configs de sesión ---
SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=1.00,
    participation_fee=0.00,
    doc="",
)

SESSION_CONFIGS = [
    dict(
        name="emar_uis",
        display_name="EMAR – UIS | Empatía y Juicio Moral",
        num_demo_participants=4,
        app_sequence=["empathy_moral_judgment"],
        faculties=["Ingenierías", "Humanidades", "Otra/Neutral"],
        treatment_mix={
            "INGROUP_HUM": 0.2,
            "OUTGROUP_HUM": 0.2,
            "INGROUP_ING": 0.2,
            "OUTGROUP_ING": 0.2,
            "CONTROL": 0.2,
        },
        timeout_grouping=60,
    ),
]

# --- Campos extra usados por la app ---
PARTICIPANT_FIELDS = ["faculty"]
SESSION_FIELDS = ["treatment_mix_normalized"]

# --- Básicos ---
LANGUAGE_CODE = "es"
REAL_WORLD_CURRENCY_CODE = "COP"
USE_POINTS = True

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = environ.get("OTREE_ADMIN_PASSWORD")  # definir en Render

DEMO_PAGE_TITLE = "EMAR – UIS"
DEMO_PAGE_INTRO_HTML = ""

# **Cambia esta clave por una cadena aleatoria larga en producción**
SECRET_KEY = "cambia_esta_clave_por_una_larga_y_unica"

# Donde oTree espera los estáticos recopilados
STATIC_ROOT = "_static"

# Lista de apps de oTree para empaquetar estáticos
OTREE_APPS = ["empathy_moral_judgment"]

# Requerido por oTree/Django
INSTALLED_APPS = ["otree"]
