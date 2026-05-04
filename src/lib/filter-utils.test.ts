import { describe, it, expect } from 'vitest';
import {
  normalizeText,
  filterPosters,
  posterMatchesParty,
  posterMatchesTheme,
  posterMatchesQuery,
  posterMatchesYear,
  getPartyBySlug,
  getPartyByName,
  countByParty,
  countByDecade,
  getUniqueYears,
  sortPosters,
  PARTIES,
  THEMES,
} from './filter-utils';
import type { Poster } from './types';

// Helper to create test posters
function createPoster(overrides: Partial<Poster> = {}): Poster {
  return {
    id: 'test-1',
    title: 'Test poster',
    thumbnailUrl: '',
    rightsStatus: 'unknown',
    source: 'kb',
    ...overrides,
  };
}

describe('normalizeText', () => {
  it('should lowercase text', () => {
    expect(normalizeText('HALLO')).toBe('hallo');
  });

  it('should remove Swedish diacritics', () => {
    expect(normalizeText('Röstä')).toBe('rosta');
    expect(normalizeText('Välfärd')).toBe('valfard');
    expect(normalizeText('Åke')).toBe('ake');
  });

  it('should trim whitespace', () => {
    expect(normalizeText('  hej  ')).toBe('hej');
  });
});

describe('getPartyBySlug', () => {
  it('should find Socialdemokraterna by slug', () => {
    const party = getPartyBySlug('s');
    expect(party).toBeDefined();
    expect(party?.name).toBe('Socialdemokraterna');
  });

  it('should return undefined for unknown slug', () => {
    expect(getPartyBySlug('xyz')).toBeUndefined();
  });
});

describe('getPartyByName', () => {
  it('should find party by full name', () => {
    const party = getPartyByName('Socialdemokraterna');
    expect(party).toBeDefined();
    expect(party?.slug).toBe('s');
  });

  it('should find party by abbreviation', () => {
    const party = getPartyByName('M');
    expect(party).toBeDefined();
    expect(party?.name).toBe('Moderaterna');
  });

  it('should find party by historical name', () => {
    const party = getPartyByName('Högerpartiet');
    expect(party).toBeDefined();
    expect(party?.slug).toBe('m');
  });

  it('should be case-insensitive', () => {
    expect(getPartyByName('socialdemokraterna')?.slug).toBe('s');
    expect(getPartyByName('MODERATERNA')?.slug).toBe('m');
  });
});

describe('posterMatchesParty', () => {
  it('should match by party field', () => {
    const poster = createPoster({ party: 'Socialdemokraterna' });
    expect(posterMatchesParty(poster, 's')).toBe(true);
  });

  it('should match by party abbreviation in field', () => {
    const poster = createPoster({ party: 'S' });
    expect(posterMatchesParty(poster, 's')).toBe(true);
  });

  it('should match historical party names', () => {
    const poster = createPoster({ party: 'SAP' });
    expect(posterMatchesParty(poster, 's')).toBe(true);
  });

  it('should match party reference in title', () => {
    const poster = createPoster({ title: 'Rösta med Socialdemokraterna!' });
    expect(posterMatchesParty(poster, 's')).toBe(true);
  });

  it('should not match unrelated party', () => {
    const poster = createPoster({ party: 'Moderaterna' });
    expect(posterMatchesParty(poster, 's')).toBe(false);
  });

  it('should return false for unknown party slug', () => {
    const poster = createPoster({ party: 'Socialdemokraterna' });
    expect(posterMatchesParty(poster, 'unknown')).toBe(false);
  });
});

describe('posterMatchesTheme', () => {
  it('should match by themes array', () => {
    const poster = createPoster({ themes: ['Rösträtt', 'Demokrati'] });
    expect(posterMatchesTheme(poster, 'rostratt')).toBe(true);
  });

  it('should match theme keywords in title', () => {
    const poster = createPoster({ title: 'Kämpa för din rösträtt!' });
    expect(posterMatchesTheme(poster, 'rostratt')).toBe(true);
  });

  it('should match theme keywords in slogan', () => {
    const poster = createPoster({ slogan: 'Arbete åt alla' });
    expect(posterMatchesTheme(poster, 'arbete')).toBe(true);
  });

  it('should return false for non-matching theme', () => {
    const poster = createPoster({ title: 'Rösta rätt' });
    expect(posterMatchesTheme(poster, 'miljo')).toBe(false);
  });
});

describe('posterMatchesQuery', () => {
  it('should match title', () => {
    const poster = createPoster({ title: 'Rösta för fred' });
    expect(posterMatchesQuery(poster, 'fred')).toBe(true);
  });

  it('should match creator', () => {
    const poster = createPoster({ creator: 'Karl Andersson' });
    expect(posterMatchesQuery(poster, 'andersson')).toBe(true);
  });

  it('should match year as string', () => {
    const poster = createPoster({ year: 1921 });
    expect(posterMatchesQuery(poster, '1921')).toBe(true);
  });

  it('should be case-insensitive', () => {
    const poster = createPoster({ title: 'FRED' });
    expect(posterMatchesQuery(poster, 'fred')).toBe(true);
  });

  it('should match wildcard query', () => {
    const poster = createPoster({ title: 'Anything' });
    expect(posterMatchesQuery(poster, '*')).toBe(true);
  });

  it('should match empty query', () => {
    const poster = createPoster({ title: 'Anything' });
    expect(posterMatchesQuery(poster, '')).toBe(true);
  });
});

describe('posterMatchesYear', () => {
  it('should match exact year', () => {
    const poster = createPoster({ year: 1921 });
    expect(posterMatchesYear(poster, 1921)).toBe(true);
  });

  it('should not match different year', () => {
    const poster = createPoster({ year: 1921 });
    expect(posterMatchesYear(poster, 1924)).toBe(false);
  });

  it('should match year in range', () => {
    const poster = createPoster({ year: 1930 });
    expect(posterMatchesYear(poster, undefined, 1920, 1940)).toBe(true);
  });

  it('should not match year outside range', () => {
    const poster = createPoster({ year: 1950 });
    expect(posterMatchesYear(poster, undefined, 1920, 1940)).toBe(false);
  });

  it('should return false for poster without year', () => {
    const poster = createPoster({ year: undefined });
    expect(posterMatchesYear(poster, 1921)).toBe(false);
  });
});

describe('filterPosters', () => {
  const testPosters: Poster[] = [
    createPoster({ id: '1', title: 'S affisch 1921', party: 'Socialdemokraterna', year: 1921 }),
    createPoster({ id: '2', title: 'M affisch 1928', party: 'Moderaterna', year: 1928 }),
    createPoster({ id: '3', title: 'S affisch 1932', party: 'SAP', year: 1932 }),
    createPoster({ id: '4', title: 'Fred i vår tid', year: 1936 }),
  ];

  it('should filter by party', () => {
    const result = filterPosters(testPosters, { party: 's' });
    expect(result).toHaveLength(2);
    expect(result.map(p => p.id)).toContain('1');
    expect(result.map(p => p.id)).toContain('3');
  });

  it('should filter by year', () => {
    const result = filterPosters(testPosters, { year: 1921 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter by year range', () => {
    const result = filterPosters(testPosters, { fromYear: 1930, toYear: 1940 });
    expect(result).toHaveLength(2);
  });

  it('should filter by query', () => {
    const result = filterPosters(testPosters, { query: 'fred' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });

  it('should combine multiple filters', () => {
    const result = filterPosters(testPosters, { party: 's', year: 1932 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('should return all posters with no filters', () => {
    const result = filterPosters(testPosters, {});
    expect(result).toHaveLength(4);
  });
});

describe('sortPosters', () => {
  const testPosters: Poster[] = [
    createPoster({ id: '1', title: 'Zebra', year: 1932 }),
    createPoster({ id: '2', title: 'Alfa', year: 1921 }),
    createPoster({ id: '3', title: 'Beta', year: 1928 }),
  ];

  it('should sort by year ascending', () => {
    const result = sortPosters(testPosters, { field: 'year', direction: 'asc' });
    expect(result.map(p => p.year)).toEqual([1921, 1928, 1932]);
  });

  it('should sort by year descending', () => {
    const result = sortPosters(testPosters, { field: 'year', direction: 'desc' });
    expect(result.map(p => p.year)).toEqual([1932, 1928, 1921]);
  });

  it('should sort by title', () => {
    const result = sortPosters(testPosters, { field: 'title', direction: 'asc' });
    expect(result.map(p => p.title)).toEqual(['Alfa', 'Beta', 'Zebra']);
  });
});

describe('countByParty', () => {
  const testPosters: Poster[] = [
    createPoster({ party: 'Socialdemokraterna' }),
    createPoster({ party: 'S' }),
    createPoster({ party: 'Moderaterna' }),
    createPoster({ party: undefined }),
  ];

  it('should count posters by party', () => {
    const counts = countByParty(testPosters);
    expect(counts.get('s')).toBe(2);
    expect(counts.get('m')).toBe(1);
  });
});

describe('countByDecade', () => {
  const testPosters: Poster[] = [
    createPoster({ year: 1921 }),
    createPoster({ year: 1928 }),
    createPoster({ year: 1932 }),
    createPoster({ year: undefined }),
  ];

  it('should count posters by decade', () => {
    const counts = countByDecade(testPosters);
    expect(counts.get(1920)).toBe(2);
    expect(counts.get(1930)).toBe(1);
  });
});

describe('getUniqueYears', () => {
  const testPosters: Poster[] = [
    createPoster({ year: 1921 }),
    createPoster({ year: 1928 }),
    createPoster({ year: 1921 }),
    createPoster({ year: undefined }),
  ];

  it('should return unique years sorted descending', () => {
    const years = getUniqueYears(testPosters);
    expect(years).toEqual([1928, 1921]);
  });
});

describe('PARTIES constant', () => {
  it('should have 8 major parties defined', () => {
    expect(PARTIES.length).toBe(8);
  });

  it('should have required fields for each party', () => {
    PARTIES.forEach(party => {
      expect(party.slug).toBeDefined();
      expect(party.name).toBeDefined();
      expect(party.abbreviation).toBeDefined();
      expect(party.aliases).toBeInstanceOf(Array);
    });
  });
});

describe('THEMES constant', () => {
  it('should have themes defined', () => {
    expect(THEMES.length).toBeGreaterThan(0);
  });

  it('should have keywords for each theme', () => {
    THEMES.forEach(theme => {
      expect(theme.keywords.length).toBeGreaterThan(0);
    });
  });
});
