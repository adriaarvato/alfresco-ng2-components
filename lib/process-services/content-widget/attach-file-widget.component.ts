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

/* tslint:disable:component-selector */

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
    baseHost,
    UploadWidgetComponent,
    FormService,
    LogService,
    ThumbnailService,
    ProcessContentService,
    ActivitiContentService,
    ContentService,
    FormEvent
} from '@alfresco/adf-core';
import { ContentNodeDialogService } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'attach-widget',
    templateUrl: './attach-file-widget.component.html',
    styleUrls: ['./attach-file-widget.component.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class AttachFileWidgetComponent extends UploadWidgetComponent implements OnInit {

    repositoryList = [];
    private tempFilesList = [];

    constructor(public formService: FormService,
                private logger: LogService,
                public thumbnails: ThumbnailService,
                public processContentService: ProcessContentService,
                private activitiContentService: ActivitiContentService,
                private contentService: ContentService,
                private contentDialog: ContentNodeDialogService) {
        super(formService, logger, thumbnails, processContentService);
    }

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
        }
        this.getMultipleFileParam();

        this.activitiContentService.getAlfrescoRepositories(null, true).subscribe((repoList) => {
            this.repositoryList = repoList;
        });

        this.formService.taskSaved.subscribe((formSaved: FormEvent) => {
            if (formSaved.form.id === this.field.form.id) {
                this.tempFilesList = [];
            }
        });
    }

    isFileSourceConfigured(): boolean {
        return !!this.field.params && !!this.field.params.fileSource;
    }

    isMultipleSourceUpload(): boolean {
        return !this.field.readOnly && this.isFileSourceConfigured() && !this.isOnlyLocalSourceSelected();
    }

    isAllFileSourceSelected(): boolean {
        return this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'all-file-sources';
    }

    isOnlyLocalSourceSelected(): boolean {
        return this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'local-file';
    }

    isSimpleUploadButton(): boolean {
        return this.isUploadButtonVisible() &&
            !this.isFileSourceConfigured() ||
            this.isOnlyLocalSourceSelected();
    }

    isUploadButtonVisible(): boolean {
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    isDefinedSourceFolder(): boolean {
        return !!this.field.params &&
            !!this.field.params.fileSource &&
            !!this.field.params.fileSource.selectedFolder;
    }

    isTemporaryFile(file): boolean {
        return this.tempFilesList.indexOf(file) !== -1 ? true : false;
    }

    openSelectDialogFromFileSource() {
        let params = this.field.params;
        if (this.isDefinedSourceFolder()) {
            this.contentDialog.openFileBrowseDialogByFolderId(params.fileSource.selectedFolder.pathId).subscribe(
                (selections: MinimalNodeEntryEntity[]) => {
                    this.uploadFileFromCS(selections,
                        this.field.params.fileSource.selectedFolder.accountId,
                        this.field.params.fileSource.selectedFolder.siteId);
                });
        }
    }

    onAttachFileChanged(event: any) {
        this.tempFilesList.push(...Array.from(event.target.files));
        this.onFileChanged(event);
    }

    onRemoveAttachFile(file: any) {
        if (this.isTemporaryFile(file.contentBlob)) {
            this.tempFilesList.splice(this.tempFilesList.indexOf(file.contentBlob), 1);
        }
        this.removeFile(file);
    }

    onAttachFileClicked(file: any) {
        if (this.isTemporaryFile(file.contentBlob)) {
            this.formService.formContentClicked.next(file);
        } else {
            this.fileClicked(file);
        }
    }

    downloadContent(file: any): void {
        if (this.isTemporaryFile(file.contentBlob)) {
            this.contentService.downloadBlob(file.contentBlob, file.name);
        } else {
            this.processContentService.getFileRawContent(file.id).subscribe(
                (blob: Blob) => {
                    this.contentService.downloadBlob(blob, file.name);
                },
                (err) => {
                    this.logger.error('Impossible retrieve content for download');
                }
            );
        }
    }

    openSelectDialog(repoId: string, repoName: string) {
        const accountIdentifier = 'alfresco-' + repoId + repoName;
        this.contentDialog.openFileBrowseDialogBySite().subscribe(
            (selections: MinimalNodeEntryEntity[]) => {
                this.uploadFileFromCS(selections, accountIdentifier);
            });
    }

    private uploadFileFromCS(fileNodeList: MinimalNodeEntryEntity[], accountId: string, siteId?: string) {
        let filesSaved = [];
        Observable.from(fileNodeList)
            .mergeMap(node =>
                this.activitiContentService.applyAlfrescoNode(node,
                    siteId,
                    accountId)
            ).subscribe((res) => {
                filesSaved.push(res);
            },
            (error) => {
                this.logger.error(error);
            },
            () => {
                this.field.value = filesSaved;
                this.field.json.value = filesSaved;
            });
        this.hasFile = true;
    }

}
