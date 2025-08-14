from otree.api import *

from .models import *
from .pages import *

page_sequence = [
    ConsentFaculty,
    GroupWait,
    NegotiatorDecision,
    Results,
    MoralJudge,
    End
]
