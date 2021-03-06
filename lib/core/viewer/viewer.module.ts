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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { PipeModule } from '../pipes/pipe.module';
import { ImgViewerComponent } from './components/imgViewer.component';
import { MediaPlayerComponent } from './components/mediaPlayer.component';
import { PdfViewerComponent } from './components/pdfViewer.component';
import { PdfThumbComponent } from './components/pdfViewer-thumb.component';
import { PdfThumbListComponent } from './components/pdfViewer-thumbnails.component';
import { TxtViewerComponent } from './components/txtViewer.component';
import { UnknownFormatComponent } from './components/unknown-format/unknown-format.component';
import { ViewerMoreActionsComponent } from './components/viewer-more-actions.component';
import { ViewerOpenWithComponent } from './components/viewer-open-with.component';
import { ViewerSidebarComponent } from './components/viewer-sidebar.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar.component';
import { ViewerComponent } from './components/viewer.component';
import { ViewerExtensionDirective } from './directives/viewer-extension.directive';
import { ViewerToolbarActionsComponent } from './components/viewer-toolbar-actions.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        ToolbarModule,
        PipeModule,
        FlexLayoutModule
    ],
    declarations: [
        ViewerComponent,
        ImgViewerComponent,
        TxtViewerComponent,
        MediaPlayerComponent,
        PdfViewerComponent,
        PdfThumbComponent,
        PdfThumbListComponent,
        ViewerExtensionDirective,
        UnknownFormatComponent,
        ViewerToolbarComponent,
        ViewerSidebarComponent,
        ViewerOpenWithComponent,
        ViewerMoreActionsComponent,
        ViewerToolbarActionsComponent
    ],
    exports: [
        ViewerComponent,
        ImgViewerComponent,
        TxtViewerComponent,
        MediaPlayerComponent,
        PdfViewerComponent,
        PdfThumbComponent,
        PdfThumbListComponent,
        ViewerExtensionDirective,
        UnknownFormatComponent,
        ViewerToolbarComponent,
        ViewerSidebarComponent,
        ViewerOpenWithComponent,
        ViewerMoreActionsComponent,
        ViewerToolbarActionsComponent
    ]
})
export class ViewerModule {
}
