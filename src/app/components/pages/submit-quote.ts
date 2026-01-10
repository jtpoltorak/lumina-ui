import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-quote',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div
      class="page-container"
      *ngIf="!isSubmitted(); else thankYouTemplate"
    >
      <a
        routerLink="/"
        class="back-link"
        ><i class="fa-solid fa-arrow-left"></i> Back to Quotes</a
      >
      <h1>Submit a Quote</h1>
      <p class="subtitle">
        Have a favorite quote? Share it with us.
      </p>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="quote">Quote Text</label>
          <textarea
            id="quote"
            name="quote"
            [(ngModel)]="quoteText"
            rows="4"
            placeholder="Enter the quote here..."
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            [(ngModel)]="author"
            placeholder="Who said it?"
            required
          />
        </div>

        <div class="actions">
          <a
            routerLink="/"
            class="btn-cancel"
            >Cancel</a
          >
          <button
            type="submit"
            class="btn-submit"
            [disabled]="!quoteText || !author"
          >
            Submit Quote
          </button>
        </div>
      </form>
    </div>

    <ng-template #thankYouTemplate>
      <div class="page-container centered">
        <div class="start-icon">
          <i class="fa-solid fa-check"></i>
        </div>
        <h1>Thank You!</h1>
        <p>Your quote has been submitted for review.</p>
        <a
          routerLink="/"
          class="btn-primary"
          >Return to Quotes</a
        >
      </div>
    </ng-template>
  `,
  styles: [
    `
      .page-container {
        padding: 40px 20px;
        max-width: 600px;
        margin: 0 auto;
        color: var(--color-text-primary);
        font-family: 'Barlow', sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .centered {
        text-align: center;
      }
      .back-link {
        display: inline-block;
        margin-bottom: 30px;
        color: var(--color-accent);
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.2s;
      }
      .back-link:hover {
        opacity: 0.8;
      }

      h1 {
        font-weight: 300;
        margin-bottom: 10px;
        font-size: 2.5rem;
      }
      .subtitle {
        opacity: 0.7;
        margin-bottom: 30px;
      }

      .form-group {
        margin-bottom: 25px;
      }
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        opacity: 0.9;
      }

      input,
      textarea {
        width: 100%;
        background: rgba(
          255,
          255,
          255,
          0.05
        ); /* Works for dark/light usually */
        border: 2px solid transparent;
        border-bottom: 2px solid rgba(128, 128, 128, 0.3);
        border-radius: 8px;
        padding: 12px 15px;
        color: inherit;
        font-family: inherit;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-bottom-color: var(--color-accent);
          background: rgba(255, 255, 255, 0.1);
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 20px;
        margin-top: 30px;
      }

      .btn-cancel {
        color: inherit;
        text-decoration: none;
        opacity: 0.7;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .btn-cancel:hover {
        opacity: 1;
      }

      .btn-submit,
      .btn-primary {
        background-color: var(--color-accent);
        color: white; // Always white text on accent
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-family: inherit;
        font-weight: 500;
        cursor: pointer;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
        text-decoration: none;
        display: inline-block;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(226, 119, 58, 0.4); // Approx orange
          // glow
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      }

      .start-icon {
        font-size: 3rem;
        color: var(--color-accent);
        margin-bottom: 20px;
      }
    `,
  ],
})
export class SubmitQuoteComponent {
  quoteText = '';
  author = '';
  isSubmitted = signal(false);

  onSubmit() {
    if (this.quoteText && this.author) {
      // Here we would actually send data to backend
      this.isSubmitted.set(true);
    }
  }
}
