import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map, BehaviorSubject } from 'rxjs';

export interface Quote {
  id: string;
  number: number;
  content: string;
  author: string;
  categories: string[];
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private quotesUrl = 'assets/quotes.json';
  private quotes$: Observable<Quote[]>;
  private shownQuoteIds = new Set<string>();

  // State for active category filter
  private activeCategorySignal = new BehaviorSubject<string | null>(null);
  activeCategory$ = this.activeCategorySignal.asObservable();

  constructor(private http: HttpClient) {
    this.quotes$ = this.http
      .get<Quote[]>(this.quotesUrl)
      .pipe(shareReplay(1));
  }

  getQuoteById(id: string): Observable<Quote | undefined> {
    return this.quotes$.pipe(
      map((quotes) => quotes.find((q) => q.id === id)),
    );
  }

  getUniqueCategories(): Observable<string[]> {
    return this.quotes$.pipe(
      map((quotes) => {
        const categories = new Set<string>();
        quotes.forEach((q) => {
          if (q.categories) {
            q.categories.forEach((c) => categories.add(c));
          }
        });
        return Array.from(categories).sort();
      }),
    );
  }

  getCategoryCounts(): Observable<Record<string, number>> {
    return this.quotes$.pipe(
      map((quotes) => {
        const counts: Record<string, number> = {};
        quotes.forEach((q) => {
          if (q.categories) {
            q.categories.forEach((c) => {
              counts[c] = (counts[c] || 0) + 1;
            });
          }
        });
        return counts;
      }),
    );
  }

  setCategory(category: string | null) {
    this.activeCategorySignal.next(category);
    // When changing filters, we might want to clear history to allow re-seeing quotes
    this.shownQuoteIds.clear();
  }

  getActiveCategory(): string | null {
    return this.activeCategorySignal.value;
  }

  getRandomQuote(): Observable<Quote> {
    return this.quotes$.pipe(
      map((quotes) => {
        if (quotes.length === 0) {
          throw new Error('No quotes available');
        }

        const activeCategory = this.activeCategorySignal.value;

        // 1. Filter by category if active
        let candidateQuotes = activeCategory
          ? quotes.filter(q => q.categories && q.categories.includes(activeCategory))
          : quotes;

        if (candidateQuotes.length === 0) {
          // Fallback if category has no quotes (shouldn't happen with correct data)
          candidateQuotes = quotes;
        }

        // 2. Filter out already shown quotes
        const availableQuotes = candidateQuotes.filter(
          (q) => !this.shownQuoteIds.has(q.id),
        );

        // 3. Reset history if all shown
        if (availableQuotes.length === 0) {
          // If we exhausted the category, just reset history for that category
          // (candidateQuotes are all quotes in that category)
          candidateQuotes.forEach(q => this.shownQuoteIds.delete(q.id));

          return candidateQuotes[
            Math.floor(Math.random() * candidateQuotes.length)
          ];
        }

        const randomIndex = Math.floor(
          Math.random() * availableQuotes.length,
        );
        const selectedQuote = availableQuotes[randomIndex];
        this.shownQuoteIds.add(selectedQuote.id);
        return selectedQuote;
      }),
    );
  }
}
