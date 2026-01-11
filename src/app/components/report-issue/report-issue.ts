import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService, Quote } from '../../services/quote';
import { ThemeService } from '../../services/theme';

@Component({
    selector: 'app-report-issue',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './report-issue.html',
    styleUrl: './report-issue.scss',
})
export class ReportIssueComponent implements OnInit {
    reportForm: FormGroup;
    isSubmitted = signal(false);
    reportedQuote = signal<Quote | null>(null);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public themeService: ThemeService,
        private quoteService: QuoteService
    ) {
        this.reportForm = this.fb.group({
            quoteId: ['', Validators.required],
            quoteNum: [''], // Optional/Readonly
            issueType: ['typo', Validators.required],
            description: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const quoteId = params['quoteId'];
            const quoteNum = params['quoteNum'];
            if (quoteId) {
                this.reportForm.patchValue({ quoteId, quoteNum });

                // Fetch full quote details
                this.quoteService.getQuoteById(quoteId).subscribe(q => {
                    this.reportedQuote.set(q || null);
                });
            }
        });
    }

    onSubmit() {
        if (this.reportForm.valid) {
            console.log('Issue Reported:', this.reportForm.value);
            this.isSubmitted.set(true);

            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your report!');
                this.goBack();
            }, 1000);
        }
    }

    goBack() {
        const quoteId = this.reportForm.get('quoteId')?.value;
        if (quoteId) {
            this.router.navigate(['/'], { queryParams: { id: quoteId } });
        } else {
            this.router.navigate(['/']);
        }
    }
}
