import { Routes } from '@angular/router';
import { QuoteDisplayComponent } from './components/quote-display/quote-display';
import { AboutComponent } from './components/pages/about';
import { ContactComponent } from './components/pages/contact';
import { PrivacyPolicyComponent } from './components/pages/privacy';
import { SubmitQuoteComponent } from './components/pages/submit-quote';
import { ReportIssueComponent } from './components/report-issue/report-issue';

export const routes: Routes = [
  { path: '', component: QuoteDisplayComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'submit', component: SubmitQuoteComponent },
  { path: 'report-issue', component: ReportIssueComponent },
  { path: '**', redirectTo: '' },
];
