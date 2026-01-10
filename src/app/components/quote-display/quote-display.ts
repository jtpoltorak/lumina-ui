import {
  Component,
  signal,
  OnInit,
  Inject,
  HostListener,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuoteService, Quote } from '../../services/quote';
import { ThemeService } from '../../services/theme';
import {
  trigger,
  transition,
  style,
  animate,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-quote-display',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quote-display.html',
  styleUrl: './quote-display.scss',
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        query(':enter', [style({ opacity: 0 })], {
          optional: true,
        }),
        query(
          ':leave',
          [animate('300ms ease-out', style({ opacity: 0 }))],
          { optional: true },
        ),
        query(
          ':enter',
          [animate('800ms ease-in', style({ opacity: 1 }))],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class QuoteDisplayComponent implements OnInit {
  quote = signal<Quote | null>(null);
  currentYear = new Date().getFullYear();
  isFullscreen = signal(false);

  // Expose active category to template
  activeCategory$: any;
  allCategories$: any;

  isFilterOpen = signal(false);

  constructor(
    private quoteService: QuoteService,
    public themeService: ThemeService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.activeCategory$ = this.quoteService.activeCategory$;
    this.allCategories$ = this.quoteService.getUniqueCategories();
  }

  ngOnInit() {
    this.handleInitialLoad();
  }

  toggleFilter() {
    this.isFilterOpen.update(v => !v);
  }

  closeFilter() {
    this.isFilterOpen.set(false);
  }

  selectCategory(category: string) {
    this.toggleCategory(category);
    this.closeFilter();
  }

  toggleCategory(category: string) {
    const currentActive = this.quoteService.getActiveCategory();
    if (currentActive === category) {
      // If clicking the currently active category, unlock it (clear filter)
      this.quoteService.setCategory(null);
    } else {
      // Otherwise, lock to this category
      this.quoteService.setCategory(category);
    }
    // After toggling, we probably want to load a fresh quote that respects the new filter
    this.loadNewQuote();
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreenChange(event: Event) {
    this.isFullscreen.set(!!this.document.fullscreenElement);
  }

  handleInitialLoad() {
    // Check for ID in URL
    const urlParams = new URLSearchParams(
      window.location.search,
    );
    const id = urlParams.get('id');

    if (id) {
      this.quoteService.getQuoteById(id).subscribe((q) => {
        if (q) {
          this.quote.set(q);
        } else {
          this.loadNewQuote();
        }
      });
    } else {
      this.loadNewQuote();
    }
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  @HostListener('document:keydown.space', ['$event'])
  handleKeyboardEvent(event: Event) {
    this.loadNewQuote();
  }

  loadNewQuote() {
    this.quoteService.getRandomQuote().subscribe((q) => {
      this.quote.set(q);
      this.updateUrl(q.id);
    });
  }

  updateUrl(id: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    window.history.replaceState({}, '', url);
  }

  toggleFullscreen() {
    if (!this.document.fullscreenElement) {
      this.document.documentElement.requestFullscreen();
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      }
    }
  }

  // Share Menu Logic
  isShareMenuOpen = signal(false);

  toggleShareMenu(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent document click from closing immediately
    }
    this.isShareMenuOpen.update((v) => !v);
  }

  @HostListener('document:click')
  closeShareMenu() {
    if (this.isShareMenuOpen()) {
      this.isShareMenuOpen.set(false);
    }
  }

  copyToClipboard() {
    const q = this.quote();
    if (q) {
      const text = `"${q.content}" - ${q.author}`;
      navigator.clipboard.writeText(text).then(() => {
        // Ideally show a toast here
        console.log('Copied to clipboard');
      });
    }
  }

  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      console.log('Link copied');
    });
  }

  shareOnTwitter() {
    const q = this.quote();
    if (q) {
      const text = `"${q.content}" - ${q.author}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  }

  shareOnPinterest() {
    const q = this.quote();
    if (!q) return;
    const url = encodeURIComponent(window.location.href);
    const description = encodeURIComponent(
      `"${q.content}" - ${q.author}`,
    );
    window.open(
      `https://pinterest.com/pin/create/button/?url=${url}&description=${description}`,
      '_blank',
    );
  }

  downloadWallpaper() {
    const q = this.quote();
    if (!q) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine dimensions
    // Target 2k (2560x1440) for desktop, or device resolution
    // for mobile
    let width = 2560;
    let height = 1440;

    // Simple mobile detection checks
    if (window.innerWidth < 1024) {
      width = window.innerWidth * window.devicePixelRatio;
      height = window.innerHeight * window.devicePixelRatio;
    }

    canvas.width = width;
    canvas.height = height;

    // Get styling from current theme
    const styles = getComputedStyle(document.body);
    const bgColor = styles
      .getPropertyValue('--color-bg-primary')
      .trim();
    const textColor = styles
      .getPropertyValue('--color-text-primary')
      .trim();
    // const accentColor = styles.getPropertyValue('--color-accent').trim();

    // 1. Fill Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Configure Text
    const fontSize = width < 1000 ? width * 0.05 : 60; // Responsive
    // font size
    ctx.font = `900 ${fontSize}px 'Barlow', sans-serif`; // Weight
    // 900 matches app (Barlow Black)
    // 300 matches app
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 3. Draw Quote (Wrapped)
    const quoteText = `"${q.content}"`;
    const maxWidth = width * 0.8; // 80% padding
    const lineHeight = fontSize * 1.5;
    const x = width / 2;
    // Calculate vertical center offset
    // We need to simulate wrap first to know total height
    const lines = this.getWrappedLines(ctx, quoteText, maxWidth);
    const totalTextHeight = lines.length * lineHeight;
    let y = height / 2 - totalTextHeight / 2;

    // Draw lines
    lines.forEach((line) => {
      ctx.fillText(line, x, y);
      y += lineHeight;
    });

    // 4. Draw Author
    y += lineHeight * 0.5; // Spacing
    ctx.font = `600 ${fontSize * 0.6}px 'Barlow', sans-serif`; // SemiBold
    ctx.fillText(`— ${q.author}`, x, y);

    // 5. Draw Footer branding
    const footerText = 'LUMINA © jtp-development';
    ctx.font = `400 ${width * 0.015}px 'Barlow', sans-serif`; // Regular, tracked out
    ctx.globalAlpha = 0.5; // Subtle
    // Manually approximate letter spacing by drawing chars?
    // Canvas letter-spacing is supported in modern browsers but
    // let's stick to standard fillText for safety Or just use the
    // font we have.
    ctx.fillText(
      footerText.toUpperCase(),
      width / 2,
      height - height * 0.05,
    );

    // 6. Download
    // Generate UUID-like string
    const uuid = crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    const filename = `lumina-download-${uuid}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Helper to wrap text
  private getWrappedLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(
        currentLine + ' ' + word,
      ).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  shareOnInstagram() {
    // Instagram doesn't support web share intent for text.
    // Best practice is to copy to clipboard and open instagram.
    this.copyToClipboard();
    window.open('https://instagram.com', '_blank');
  }
}
