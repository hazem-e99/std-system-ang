import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  template: `
    <div class="question-form-container">
      <div class="form-header">
        <button class="back-btn" (click)="goBack()">
          <i class="fas fa-arrow-left"></i>
          Back
        </button>
        <div class="header-content">
          <h1>{{ isEditMode() ? 'Edit Question' : 'Add New Question' }}</h1>
          <p>{{ isEditMode() ? 'Update question details' : 'Create a new question for your exam' }}</p>
        </div>
      </div>

      @if (isLoading()) {
        <app-loading message="Loading question data..."></app-loading>
      } @else {
        <form [formGroup]="questionForm" (ngSubmit)="onSubmit()" class="question-form">
          <div class="form-section">
            <h2>Question Details</h2>
            
            <div class="form-group">
              <label for="examId" class="form-label">Select Exam</label>
              <select
                id="examId"
                formControlName="examId"
                class="form-control"
                [class.form-control--error]="isFieldInvalid('examId')">
                <option value="">Choose an exam</option>
                @for (exam of exams(); track exam.id) {
                  <option [value]="exam.id">{{ exam.title }}</option>
                }
              </select>
              @if (isFieldInvalid('examId')) {
                <div class="form-error">Please select an exam</div>
              }
            </div>

            <div class="form-group">
              <label for="text" class="form-label">Question Text</label>
              <textarea
                id="text"
                formControlName="text"
                class="form-control"
                [class.form-control--error]="isFieldInvalid('text')"
                placeholder="Enter your question here..."
                rows="4"></textarea>
              @if (isFieldInvalid('text')) {
                <div class="form-error">Question text is required</div>
              }
            </div>

            <div class="form-group">
              <label for="marks" class="form-label">Marks</label>
              <input
                type="number"
                id="marks"
                formControlName="marks"
                class="form-control"
                [class.form-control--error]="isFieldInvalid('marks')"
                placeholder="Enter marks for this question"
                min="1">
              @if (isFieldInvalid('marks')) {
                <div class="form-error">
                  @if (questionForm.get('marks')?.errors?.['required']) {
                    Marks are required
                  }
                  @if (questionForm.get('marks')?.errors?.['min']) {
                    Marks must be at least 1
                  }
                </div>
              }
            </div>
          </div>

          <div class="form-section">
            <h2>Answer Options</h2>
            <p class="section-description">Add 4 options and select the correct answer</p>
            
            <div formArrayName="options" class="options-container">
              @for (option of optionsArray.controls; track $index; let i = $index) {
                <div [formGroupName]="i" class="option-group">
                  <div class="option-header">
                    <span class="option-number">Option {{ i + 1 }}</span>
                    <label class="correct-option-label">
                      <input
                        type="radio"
                        [value]="i"
                        formControlName="correctOption"
                        class="correct-option-radio">
                      <span class="correct-option-text">Correct Answer</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    formControlName="text"
                    class="form-control"
                    [class.form-control--error]="isOptionInvalid(i)"
                    [placeholder]="'Enter option ' + (i + 1)">
                  @if (isOptionInvalid(i)) {
                    <div class="form-error">Option text is required</div>
                  }
                </div>
              }
            </div>

            @if (isFieldInvalid('correctOption')) {
              <div class="form-error">Please select the correct answer</div>
            }
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn--secondary" (click)="goBack()">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn--primary"
              [disabled]="questionForm.invalid || isSubmitting()">
              @if (isSubmitting()) {
                <i class="fas fa-spinner fa-spin"></i>
                {{ isEditMode() ? 'Updating...' : 'Creating...' }}
              } @else {
                <i class="fas fa-save"></i>
                {{ isEditMode() ? 'Update Question' : 'Create Question' }}
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .question-form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background: #f1f5f9;
      color: #475569;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .header-content p {
      color: #64748b;
      margin: 0;
    }

    .question-form {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .form-section {
      padding: 2rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .form-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .section-description {
      color: #64748b;
      margin: 0 0 1.5rem 0;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-control {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control--error {
      border-color: #ef4444;
    }

    .form-control--error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .option-group {
      border: 2px solid #f1f5f9;
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.2s;
    }

    .option-group:hover {
      border-color: #e2e8f0;
    }

    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .option-number {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .correct-option-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: #059669;
      font-weight: 500;
    }

    .correct-option-radio {
      margin: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 2rem;
      background: #f8fafc;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn--primary {
      background: #3b82f6;
      color: white;
    }

    .btn--primary:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
    }

    .btn--primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }

    .btn--secondary {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .btn--secondary:hover {
      background: #f1f5f9;
      color: #475569;
    }

    @media (max-width: 768px) {
      .question-form-container {
        padding: 1rem;
      }

      .form-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class QuestionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private loading = signal(true);
  private submitting = signal(false);
  private editMode = signal(false);
  private availableExams = signal<any[]>([]);

  readonly isLoading = this.loading.asReadonly();
  readonly isSubmitting = this.submitting.asReadonly();
  readonly isEditMode = this.editMode.asReadonly();
  readonly exams = this.availableExams.asReadonly();

  questionForm: FormGroup = this.fb.group({
    examId: ['', Validators.required],
    text: ['', Validators.required],
    marks: [5, [Validators.required, Validators.min(1)]],
    options: this.fb.array([
      this.createOptionGroup(),
      this.createOptionGroup(),
      this.createOptionGroup(),
      this.createOptionGroup()
    ]),
    correctOption: [0, Validators.required]
  });

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  ngOnInit(): void {
    this.loadExams();
    this.checkEditMode();
  }

  private createOptionGroup(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required]
    });
  }

  private async loadExams(): Promise<void> {
    try {
      const exams = await this.apiService.get<any[]>('exams').toPromise();
      this.availableExams.set(exams || []);
    } catch (error) {
      this.notificationService.error('Error', 'Failed to load exams');
    }
  }

  private checkEditMode(): void {
    const questionId = this.route.snapshot.queryParams['id'];
    if (questionId) {
      this.editMode.set(true);
      this.loadQuestion(questionId);
    } else {
      // Set default exam if provided in query params
      const examId = this.route.snapshot.queryParams['examId'];
      if (examId) {
        this.questionForm.patchValue({ examId });
      }
      this.loading.set(false);
    }
  }

  private async loadQuestion(id: string): Promise<void> {
    try {
      const question = await this.apiService.get<any>(`questions/${id}`).toPromise();
      if (question) {
        // Populate form with question data
        this.questionForm.patchValue({
          examId: question.examId,
          text: question.text,
          marks: question.marks || 5,
          correctOption: question.correctOption
        });

        // Populate options
        if (question.options && Array.isArray(question.options)) {
          question.options.forEach((option: string, index: number) => {
            if (index < 4) {
              this.optionsArray.at(index)?.patchValue({ text: option });
            }
          });
        }
      }
    } catch (error) {
      this.notificationService.error('Error', 'Failed to load question');
      this.goBack();
    } finally {
      this.loading.set(false);
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid && !this.submitting()) {
      this.submitting.set(true);

      const formValue = this.questionForm.value;
      const questionData = {
        examId: formValue.examId,
        text: formValue.text,
        options: formValue.options.map((opt: any) => opt.text),
        correctOption: formValue.correctOption,
        marks: formValue.marks,
        type: 'multiple_choice'
      };

      const operation = this.editMode() 
        ? this.updateQuestion(questionData)
        : this.createQuestion(questionData);

      operation.subscribe({
        next: () => {
          const message = this.editMode() ? 'Question updated successfully' : 'Question created successfully';
          this.notificationService.success('Success', message);
          this.goBack();
        },
        error: (error) => {
          const message = this.editMode() ? 'Failed to update question' : 'Failed to create question';
          this.notificationService.error('Error', message);
        },
        complete: () => {
          this.submitting.set(false);
        }
      });
    }
  }

  private createQuestion(questionData: any) {
    return this.apiService.post('questions', questionData);
  }

  private updateQuestion(questionData: any) {
    const questionId = this.route.snapshot.queryParams['id'];
    return this.apiService.put(`questions/${questionId}`, questionData);
  }

  goBack(): void {
    this.router.navigate(['/admin/questions']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.questionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isOptionInvalid(index: number): boolean {
    const option = this.optionsArray.at(index);
    return !!(option && option.invalid && (option.dirty || option.touched));
  }
}