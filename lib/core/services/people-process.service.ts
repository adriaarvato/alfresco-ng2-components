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

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserProcessModel } from '../models/user-process.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { LogService } from './log.service';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';

@Injectable()
export class PeopleProcessService {

    constructor(private alfrescoJsApi: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Gets information about users across all tasks.
     * @param taskId ID of the task
     * @param searchWord Filter text to search for
     */
    getWorkflowUsers(taskId?: string, searchWord?: string): Observable<UserProcessModel[]> {
        let option = { excludeTaskId: taskId, filter: searchWord };
        return Observable.fromPromise(this.getWorkflowUserApi(option))
            .map((response: any) => <UserProcessModel[]> response.data || [])
            .catch(err => this.handleError(err));
    }

    /**
     * Gets the profile picture URL for the specified user.
     * @param user The target user
     */
    getUserImage(user: UserProcessModel): string {
        return this.getUserProfileImageApi(user.id);
    }

    /**
     * Sets a user to be involved with a task.
     * @param taskId ID of the target task
     * @param idToInvolve ID of the user to involve
     */
    involveUserWithTask(taskId: string, idToInvolve: string): Observable<UserProcessModel[]> {
        let node = {userId: idToInvolve};
        return Observable.fromPromise(this.involveUserToTaskApi(taskId, node))
            .catch(err => this.handleError(err));
    }

    /**
     * Removes a user who is currently involved with a task.
     * @param taskId ID of the target task
     * @param idToRemove ID of the user to remove
     */
    removeInvolvedUser(taskId: string, idToRemove: string): Observable<UserProcessModel[]> {
        let node = {userId: idToRemove};
        return Observable.fromPromise(this.removeInvolvedUserFromTaskApi(taskId, node))
            .catch(err => this.handleError(err));
    }

    private getWorkflowUserApi(options: any) {
        return this.alfrescoJsApi.getInstance().activiti.usersWorkflowApi.getUsers(options);
    }

    private involveUserToTaskApi(taskId: string, node: any) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.involveUser(taskId, node);
    }

    private removeInvolvedUserFromTaskApi(taskId: string, node: any) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.removeInvolvedUser(taskId, node);
    }

    private getUserProfileImageApi(userId: number) {
        return this.alfrescoJsApi.getInstance().activiti.userApi.getUserProfilePictureUrl(userId);
    }

    /**
     * Throw the error
     * @param error
     */
    private handleError(error: Response) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}
