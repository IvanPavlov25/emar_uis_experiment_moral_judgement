from __future__ import annotations
from otree.api import *
from typing import List, Dict
from django.utils import timezone
import random


class Constants(BaseConstants):
    name_in_url = 'empathy_moral_judgment'
    players_per_group = 4
    num_rounds = 1
    NEG_ACCEPT_PAYOFF = 120
    NEG_REJECT_PAYOFF = 100
    VICTIM_ACCEPT_PAYOFF = 60
    VICTIM_REJECT_PAYOFF = 100
    BYSTANDER_PAYOFF = 100


class Subsession(BaseSubsession):
    def creating_session(self):
        mix = self.session.config.get('treatment_mix', {'CONTROL': 1})
        total = sum(mix.values()) or 1
        normalized = {k: v / total for k, v in mix.items()}
        self.session.treatment_mix_normalized = normalized

    def group_by_arrival_time_method(self, waiting_players: List[Player]):
        if len(waiting_players) < Constants.players_per_group:
            return
        mix: Dict[str, float] = self.session.treatment_mix_normalized
        treatments = list(mix.keys())
        weights = list(mix.values())
        tried = set()
        while len(tried) < len(treatments):
            treatment = random.choices(treatments, weights=weights)[0]
            tried.add(treatment)
            selected = self._select_players(waiting_players, treatment)
            if selected:
                for i, p in enumerate(selected):
                    p.faculty = p.participant.faculty
                    p.role = ['Negotiator1', 'Negotiator2', 'Victim', 'Bystander'][i]
                    p.observer_is_neutral = (
                        p.role == 'Bystander' and p.faculty == 'Otra/Neutral'
                    )
                    p.treatment = treatment
                print(f"Group formed: treatment={treatment}, players={[p.id_in_subsession for p in selected]}")
                return selected
        # fallback: take first four players
        selected = waiting_players[:4]
        random.shuffle(selected)
        treatment = 'CONTROL'
        for i, p in enumerate(selected):
            p.faculty = p.participant.faculty
            p.role = ['Negotiator1', 'Negotiator2', 'Victim', 'Bystander'][i]
            p.observer_is_neutral = (
                p.role == 'Bystander' and p.faculty == 'Otra/Neutral'
            )
            p.treatment = treatment
        print(f"Fallback group formed, treatment={treatment}, players={[p.id_in_subsession for p in selected]}")
        return selected

    def _select_players(self, waiting_players: List[Player], treatment: str):
        fac_map = {
            'Ingenierías': [p for p in waiting_players if p.participant.faculty == 'Ingenierías'],
            'Humanidades': [p for p in waiting_players if p.participant.faculty == 'Humanidades'],
            'Otra/Neutral': [p for p in waiting_players if p.participant.faculty == 'Otra/Neutral'],
        }
        if treatment == 'INGROUP_HUM':
            if len(fac_map['Humanidades']) >= 3:
                if fac_map['Otra/Neutral']:
                    n1, n2, v = random.sample(fac_map['Humanidades'], 3)
                    o = fac_map['Otra/Neutral'][0]
                    return [n1, n2, v, o]
        if treatment == 'OUTGROUP_HUM':
            if len(fac_map['Ingenierías']) >= 2 and fac_map['Humanidades']:
                if fac_map['Otra/Neutral']:
                    n1, n2 = random.sample(fac_map['Ingenierías'], 2)
                    v = fac_map['Humanidades'][0]
                    o = fac_map['Otra/Neutral'][0]
                    return [n1, n2, v, o]
        if treatment == 'INGROUP_ING':
            if len(fac_map['Ingenierías']) >= 3:
                if fac_map['Otra/Neutral']:
                    n1, n2, v = random.sample(fac_map['Ingenierías'], 3)
                    o = fac_map['Otra/Neutral'][0]
                    return [n1, n2, v, o]
        if treatment == 'OUTGROUP_ING':
            if len(fac_map['Humanidades']) >= 2 and fac_map['Ingenierías']:
                if fac_map['Otra/Neutral']:
                    n1, n2 = random.sample(fac_map['Humanidades'], 2)
                    v = fac_map['Ingenierías'][0]
                    o = fac_map['Otra/Neutral'][0]
                    return [n1, n2, v, o]
        if treatment == 'CONTROL':
            if len(waiting_players) >= 4:
                return random.sample(waiting_players, 4)
        return None


class Group(BaseGroup):
    treatment = models.StringField()

    def set_group_fields(self):
        players = self.get_players()
        self.treatment = players[0].treatment

    def set_payoffs(self):
        n1 = self.get_player_by_role('Negotiator1')
        n2 = self.get_player_by_role('Negotiator2')
        v = self.get_player_by_role('Victim')
        b = self.get_player_by_role('Bystander')
        accepted = n1.choice or n2.choice
        if accepted:
            n1.payoff_ue = Constants.NEG_ACCEPT_PAYOFF
            n2.payoff_ue = Constants.NEG_ACCEPT_PAYOFF
            v.payoff_ue = Constants.VICTIM_ACCEPT_PAYOFF
            b.payoff_ue = Constants.BYSTANDER_PAYOFF
        else:
            n1.payoff_ue = Constants.NEG_REJECT_PAYOFF
            n2.payoff_ue = Constants.NEG_REJECT_PAYOFF
            v.payoff_ue = Constants.VICTIM_REJECT_PAYOFF
            b.payoff_ue = Constants.BYSTANDER_PAYOFF
        for p in [n1, n2, v, b]:
            p.payoff = p.payoff_ue


class Player(BasePlayer):
    faculty = models.StringField()
    role = models.StringField()
    treatment = models.StringField()
    choice = models.BooleanField(choices=[[True, 'Aceptar'], [False, 'Rechazar']], blank=True)
    payoff_ue = models.IntegerField()
    moral_rating = models.IntegerField(min=-9, max=9, blank=True)
    observer_is_neutral = models.BooleanField(initial=True)
    decision_ts = models.StringField()
    rating_ts = models.StringField()
    consent = models.BooleanField(blank=True)


# utility
class Utils:
    @staticmethod
    def now_str() -> str:
        return timezone.now().isoformat()
