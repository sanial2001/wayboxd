'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { clientLogger } from '@/app/_lib/client-logger';
import { searchPlacesClient } from '@/app/api/client/place-service-client';
import { PlaceSearchResult } from '@/app/api/model/response/place-search-result';
import { TripPlaceOption, TripPlaceSelection } from '@/app/api/model/response/trip-place-selection';
import { formatTripPlaceLabel } from '@/lib/trip-display';
import { cn } from '@/lib/cn';

const SEARCH_DELAY_MS = 250;
const MIN_QUERY_LENGTH = 2;

type PlaceSearchFieldProps = {
  id: string;
  disabled?: boolean;
  selected: TripPlaceSelection | null;
  onQueryChange: (query: string) => void;
  onSelect: (selection: TripPlaceSelection | null) => void;
};

export function PlaceSearchField({
  id,
  disabled = false,
  selected,
  onQueryChange,
  onSelect,
}: PlaceSearchFieldProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [options, setOptions] = useState<TripPlaceOption[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (selected || query.trim().length < MIN_QUERY_LENGTH) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setSearching(true);
        try {
          const response = await searchPlacesClient(query);
          if (cancelled) {
            return;
          }
          if (response.error || !response.data || response.status >= 400) {
            setOptions([]);
            clientLogger.warn({ err: response.error }, 'Place search failed');
            return;
          }
          const nextOptions = toPlaceOptions(response.data);
          setOptions(nextOptions);
          setActiveIndex(nextOptions.length > 0 ? 0 : -1);
          setOpen(true);
        } catch (searchError) {
          if (!cancelled) {
            setOptions([]);
            clientLogger.warn({ err: searchError }, 'Place search failed');
          }
        } finally {
          if (!cancelled) {
            setSearching(false);
          }
        }
      })();
    }, SEARCH_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query, selected]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    onQueryChange(value);
    setOpen(true);
    if (value.trim().length < MIN_QUERY_LENGTH) {
      setOptions([]);
      setSearching(false);
      setActiveIndex(-1);
    }
    if (selected && value !== selected.label) {
      onSelect(null);
    }
  }

  function choose(option: TripPlaceOption) {
    setQuery(option.selection.label);
    onQueryChange(option.selection.label);
    onSelect(option.selection);
    setOpen(false);
    setOptions([]);
  }

  function clear() {
    setQuery('');
    onQueryChange('');
    onSelect(null);
    setOpen(false);
    setOptions([]);
  }

  const showList = open && !selected && query.trim().length >= MIN_QUERY_LENGTH;
  const activeOptionId =
    activeIndex >= 0 && options[activeIndex] ? `${listId}-${options[activeIndex].key}` : undefined;

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList ? activeOptionId : undefined}
        value={query}
        disabled={disabled}
        placeholder="Search a place"
        autoComplete="off"
        onChange={(event) => updateQuery(event.target.value)}
        onFocus={() => {
          if (!selected && query.trim().length >= MIN_QUERY_LENGTH) {
            setOpen(true);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => Math.min(current + 1, options.length - 1));
            return;
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
            return;
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            if (showList && options[activeIndex]) {
              choose(options[activeIndex]);
            }
            return;
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
          }
        }}
        className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 pr-16 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {query.length > 0 ? (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 font-display text-[10px] font-bold uppercase tracking-widest text-muted"
          disabled={disabled}
          onClick={clear}
        >
          Clear
        </button>
      ) : null}
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border-[3px] border-border bg-surface py-1 shadow-chunky"
        >
          {searching ? <li className="px-4 py-3 text-sm text-muted">Searching…</li> : null}
          {!searching && options.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">No places match that search.</li>
          ) : null}
          {options.map((option, index) => (
            <li
              key={option.key}
              id={`${listId}-${option.key}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                className={cn(
                  'flex w-full flex-col px-4 py-2 text-left',
                  index === activeIndex ? 'bg-surface-2' : 'hover:bg-surface-2'
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                <span className="font-medium text-ink">{option.name}</span>
                {option.detail ? <span className="text-sm text-muted">{option.detail}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function toPlaceOptions(result: PlaceSearchResult): TripPlaceOption[] {
  const local = result.local.map((place) => {
    const label = formatTripPlaceLabel(place);
    return {
      key: `local-${place.id}`,
      name: place.name,
      detail: placeDetail(place.city, place.country),
      selection: {
        label,
        placeId: place.id,
        osmHit: null,
      },
    };
  });
  const osm = result.osm.map((hit) => {
    const label = formatTripPlaceLabel(hit);
    return {
      key: `osm-${hit.externalId}`,
      name: hit.name,
      detail: placeDetail(hit.city, hit.country),
      selection: {
        label,
        placeId: null,
        osmHit: hit,
      },
    };
  });
  return [...local, ...osm];
}

function placeDetail(city: string, country: string): string {
  return [city, country]
    .map((part) => part.trim())
    .filter((part, index, parts) => part.length > 0 && parts.indexOf(part) === index)
    .join(', ');
}
