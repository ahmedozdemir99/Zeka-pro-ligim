import type { ClassTeam, MatchHistoryRecord, StudentClass } from '../types';

export interface Standing {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  scored: number;
  conceded: number;
  points: number;
}

export function leagueStandings(
  group: StudentClass | undefined,
  mode: 'duel' | 'team',
  matches: MatchHistoryRecord[],
  teams: ClassTeam[],
): Standing[] {
  if (!group) return [];
  const classMatches = matches.filter(match => match.classId === group.id && (match.mode ?? 'duel') === mode);
  const participants = mode === 'team'
    ? teams.filter(team => team.classId === group.id)
    : group.students.map(name => ({ id: undefined, name }));

  return participants.map(({ name, id }) => {
    const results = classMatches.flatMap(match => {
      const belongs = (participant: string, teamId?: string) =>
        teamId ? id === teamId : participant === name;
      if (belongs(match.p1, match.team1?.id)) return [{ scored: match.correct1, conceded: match.correct2 }];
      if (belongs(match.p2, match.team2?.id)) return [{ scored: match.correct2, conceded: match.correct1 }];
      return [];
    });
    const historical = mode === 'duel' && group.ranking && Object.hasOwn(group.ranking, name) ? group.ranking[name] : undefined;
    const wins = historical?.wins ?? results.filter(item => item.scored > item.conceded).length;
    const draws = historical?.draws ?? results.filter(item => item.scored === item.conceded).length;
    const losses = historical?.losses ?? results.filter(item => item.scored < item.conceded).length;
    return {
      name,
      played: wins + draws + losses,
      wins, draws, losses,
      scored: historical?.correct ?? results.reduce((sum, item) => sum + item.scored, 0),
      conceded: results.reduce((sum, item) => sum + item.conceded, 0),
      points: wins * 3 + draws,
    };
  }).sort((a, b) => b.points - a.points ||
    (b.scored - b.conceded) - (a.scored - a.conceded) ||
    b.scored - a.scored || a.name.localeCompare(b.name, 'tr'));
}
