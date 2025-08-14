CREATE TABLE participants (
  id UUID PRIMARY KEY,
  faculty TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE groups (
  id UUID PRIMARY KEY,
  treatment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE members (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  participant_id UUID REFERENCES participants(id),
  role TEXT NOT NULL,
  observer_is_neutral BOOLEAN,
  UNIQUE(group_id, participant_id)
);
CREATE INDEX members_group_idx ON members(group_id);
CREATE INDEX members_participant_idx ON members(participant_id);

CREATE TABLE decisions (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  participant_id UUID REFERENCES participants(id),
  choice TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX decisions_group_idx ON decisions(group_id);
CREATE INDEX decisions_participant_idx ON decisions(participant_id);

CREATE TABLE results (
  group_id UUID PRIMARY KEY REFERENCES groups(id),
  payoff_n1 INT,
  payoff_n2 INT,
  payoff_victim INT,
  payoff_observer INT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  participant_id UUID REFERENCES participants(id),
  moral_rating INT NOT NULL,
  rated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ratings_group_idx ON ratings(group_id);
CREATE INDEX ratings_participant_idx ON ratings(participant_id);
