import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <a
        routerLink="/"
        class="back-link"
        ><i class="fa-solid fa-arrow-left"></i> Back to Quotes</a
      >
      <h1>Contact Us</h1>
      <p>
        We'd love to hear from you! Whether you have suggestion
        for a new feature or a favorite quote to add.
      </p>
      <p>
        Email:
        <a href="mailto:hello@jtp-development.com"
          >hello@jtp-development.com</a
        >
      </p>
      <p>Twitter: <a href="#">@LuminaApp</a></p>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 40px 20px;
        max-width: 800px;
        margin: 0 auto;
        color: var(--color-text-primary);
        font-family: 'Barlow', sans-serif;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        margin-bottom: 20px;
        font-size: 2.5rem;
      }
      p {
        line-height: 1.6;
        opacity: 0.8;
        margin-bottom: 15px;
        font-size: 1.1rem;
      }
      a {
        color: var(--color-text-primary);
        text-decoration: underline;
      }
      a:hover {
        color: var(--color-accent);
      }
    `,
  ],
})
export class ContactComponent {}
