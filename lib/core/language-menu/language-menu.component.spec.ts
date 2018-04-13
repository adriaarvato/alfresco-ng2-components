/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService } from '../app-config/app-config.service';
import { LanguageMenuComponent } from './language-menu.component';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationService } from '../services/translation.service';
import { TranslationMock } from '../mock/translation.service.mock';

describe('LanguageMenuComponent', () => {

    let fixture: ComponentFixture<LanguageMenuComponent>;
    let component: LanguageMenuComponent;
    let appConfig: AppConfigService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageMenuComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.get(AppConfigService);
    });

    it('should have the default language', () => {
        fixture.detectChanges();
        expect(component.languages).toEqual([{ key: 'en', label: 'English'}]);
    });

    it('should fetch the languages from the app config if present', () => {
        appConfig.config.languages = [
            {
                key: 'fake-key-1',
                label: 'fake-label-1'
            },
            {
                key: 'fake-key-2',
                label: 'fake-label-2'
            }
        ];

        fixture.detectChanges();
        expect(component.languages).toEqual([
            {
                key: 'fake-key-1',
                label: 'fake-label-1'
            },
            {
                key: 'fake-key-2',
                label: 'fake-label-2'
            }
        ]);
    });
});
