from os import environ
SESSION_CONFIGS = [
    dict(
        name='empathy_moral_judgment',
        display_name='Empathy Moral Judgment',
        num_demo_participants=4,
        app_sequence=['empathy_moral_judgment'],
        faculties=['Ingenierías', 'Humanidades', 'Otra/Neutral'],
        treatment_mix={
            'INGROUP_HUM': 0.2,
            'OUTGROUP_HUM': 0.2,
            'INGROUP_ING': 0.2,
            'OUTGROUP_ING': 0.2,
            'CONTROL': 0.2,
        },
        participation_fee=0.0,
        real_world_currency_per_point=1.0,
        doc="EMAR – UIS economic experiment",
        timeout_grouping=300,
    ),
]
SESSION_FIELDS = ['treatment_mix_normalized']
PARTICIPANT_FIELDS = ['faculty']
GROUP_FIELDS = ['treatment']
PLAYER_FIELDS = [
    'role',
    'faculty',
    'treatment',
    'choice',
    'payoff_ue',
    'moral_rating',
    'observer_is_neutral',
    'decision_ts',
    'rating_ts',
]

LANGUAGE_CODE = 'es'
REAL_WORLD_CURRENCY_CODE = 'USD'
USE_POINTS = True

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = environ.get('OTREE_ADMIN_PASSWORD', 'password')
SECRET_KEY = 'emar-uis-secret-key'
INSTALLED_APPS = ['otree']
TIME_ZONE = 'America/Bogota'
