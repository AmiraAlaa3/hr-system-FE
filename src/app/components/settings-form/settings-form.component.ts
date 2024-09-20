import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../page-title/page-title.component';
import { GeneralSettingService } from '../../services/generalSetting.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [PageTitleComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css'],
})
export class SettingsFormComponent implements OnInit {
  settingId: number = 1;
  messages: string = '';
  errors: string = '';
  fatechError : string = '';
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  settingForm = new FormGroup({
    weekend1: new FormControl('', [Validators.required]),
    weekend2: new FormControl('', [Validators.required]),
    bonusHours: new FormControl(1, [Validators.required, Validators.min(1)]),
    deductionsHours: new FormControl(1, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(
    private generalSettingService: GeneralSettingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }
  loadDepartments(): void {
    this.generalSettingService.getGeneralSettings().subscribe({
      next: (response) => {
        const setting = response.data[0];
        if (setting) {
          this.settingForm.setValue({
            weekend1: setting.weekend1 ?? 'Friday',
            weekend2: setting.weekend2 ?? 'Saturday',
            bonusHours: setting.bonusHours ?? 1,
            deductionsHours: setting.deductionsHours ?? 1,
          });
        }
      },
      error: (error) => {
        this.fatechError = error.error.message;
      }
    });
  }
  get getWeekend1() {
    return this.settingForm.get('weekend1')!;
  }

  get getWeekend2() {
    return this.settingForm.get('weekend2')!;
  }

  get getBonusHours() {
    return this.settingForm.get('bonusHours')!;
  }

  get getDeductionsHours() {
    return this.settingForm.get('deductionsHours')!;
  }

  settingHandler(e: Event) {
    e.preventDefault();
    if (this.settingForm.valid) {
      this.generalSettingService
        .updateGeneralSetting(this.settingId, this.settingForm.value)
        .subscribe({
          next: () => {
            this.messages = 'Settings updated successfully!';
            this.router.navigate(['/settings']);
            this.hideMessagesAfterDelay();
          },
          error: (error) => {
            this.errors = error.error.error;
            this.loadDepartments();
            this.hideMessagesAfterDelay();
          },
        });
    } else {
      this.settingForm.markAllAsTouched();
    }
  }

  hideMessagesAfterDelay() {
    setTimeout(() => {
      this.messages = '';
      this.errors = '';
    }, 3000);
  }
}
