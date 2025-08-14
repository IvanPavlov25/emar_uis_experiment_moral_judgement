from otree.api import *
from .models import Constants, Utils


class ConsentFaculty(Page):
    form_model = 'player'
    form_fields = ['faculty', 'consent']

    def vars_for_template(self):
        return dict(faculties=self.session.config['faculties'])

    def error_message(self, values):
        if not values.get('consent'):
            return 'Debe aceptar el consentimiento para continuar.'
        if not values.get('faculty'):
            return 'Seleccione su facultad.'

    def before_next_page(self):
        self.participant.faculty = self.player.faculty


class GroupWait(WaitPage):
    group_by_arrival_time = True
    title_text = 'Por favor espera'
    body_text = 'Estamos armando grupos según tu facultad...'

    def after_all_players_arrive(self):
        self.group.set_group_fields()


class NegotiatorDecision(Page):
    form_model = 'player'
    form_fields = ['choice']

    @staticmethod
    def is_displayed(player):
        return player.role in ['Negotiator1', 'Negotiator2']

    def vars_for_template(self):
        role_label = self.player.role
        if self.group.treatment != 'CONTROL':
            role_label += f" ({self.player.faculty})"
        return dict(role_label=role_label)

    def before_next_page(self, timeout_happened=False):
        self.player.decision_ts = Utils.now_str()

    def get_timeout_seconds(player):
        return player.session.config.get('decision_timeout', 120)


class Results(Page):
    def vars_for_template(self):
        n1 = self.group.get_player_by_role('Negotiator1')
        n2 = self.group.get_player_by_role('Negotiator2')
        accepted = n1.choice or n2.choice
        return dict(accepted=accepted)

    def before_next_page(self):
        self.group.set_payoffs()


class MoralJudge(Page):
    form_model = 'player'
    form_fields = ['moral_rating']

    @staticmethod
    def is_displayed(player):
        return player.role in ['Victim', 'Bystander']

    def vars_for_template(self):
        role_label = self.player.role
        if self.group.treatment != 'CONTROL':
            role_label += f" ({self.player.faculty})"
        return dict(role_label=role_label)

    def before_next_page(self, timeout_happened=False):
        self.player.rating_ts = Utils.now_str()

    def get_timeout_seconds(player):
        return player.session.config.get('rating_timeout', 120)


class End(Page):
    pass


