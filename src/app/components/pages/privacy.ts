import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <a
        routerLink="/"
        class="back-link"
        ><i class="fa-solid fa-arrow-left"></i> Back to Quotes</a
      >
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. Lumina operates with a
        strict "no-tracking" policy.
      </p>
      <ul>
        <li>We do not collect personal data.</li>
        <li>We do not use cookies for tracking.</li>
        <li>
          Theme preferences are stored locally on your device.
        </li>
      </ul>
      <p>Last updated: December 2025</p>
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
      p,
      li {
        line-height: 1.6;
        opacity: 0.8;
        margin-bottom: 15px;
        font-size: 1.1rem;
      }
      ul {
        margin-bottom: 20px;
        padding-left: 20px;
      }
    `,
  ],
})
export class PrivacyPolicyComponent {}
