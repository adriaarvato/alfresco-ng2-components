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

/* tslint:disable:no-input-rename  */

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,
    Input, OnInit, Output, OnDestroy, ViewEncapsulation
} from '@angular/core';

import { PaginatedComponent } from './paginated-component.interface';
import { Pagination } from 'alfresco-js-api';
import { Subscription } from 'rxjs/Subscription';
import { PaginationComponentInterface } from './pagination-component.interface';
import { PaginationModel } from '../models/pagination.model';

@Component({
    selector: 'adf-infinite-pagination',
    host: { 'class': 'infinite-adf-pagination' },
    templateUrl: './infinite-pagination.component.html',
    styleUrls: ['./infinite-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class InfinitePaginationComponent implements OnInit, OnDestroy, PaginationComponentInterface {

    static DEFAULT_PAGE_SIZE: number = 25;

    static DEFAULT_PAGINATION: PaginationModel = {
        skipCount: 0,
        hasMoreItems: false,
        merge: true
    };

    /**  @deprecated 2.3.0  Pagination object. */
    @Input()
    pagination: PaginationModel;

    /** Component that provides custom pagination support. */
    @Input()
    target: PaginatedComponent;

    /** Number of items that are added with each "load more" event. */
    @Input()
    pageSize: number = InfinitePaginationComponent.DEFAULT_PAGE_SIZE;

    /** @deprecated 2.3.0 use the paginated component interface to use it. */
    /** Is a new page loading? */
    @Input('loading')
    isLoading: boolean = false;

    /** @deprecated 2.3.0 use the paginated component interface to use it. */
    /** Emitted when the "Load More" button is clicked. */
    @Output()
    loadMore: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    private paginationSubscription: Subscription;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (this.target) {
            this.paginationSubscription = this.target.pagination.subscribe(pagination => {
                this.isLoading = false;
                this.pagination = pagination;
                this.pageSize = pagination.maxItems;
                this.cdr.detectChanges();
            });
        }

        if (!this.pagination) {
            this.pagination = InfinitePaginationComponent.DEFAULT_PAGINATION;
        }
    }

    onLoadMore() {
        this.pagination.skipCount += this.pageSize;
        this.pagination.skipCount = this.pagination.skipCount;
        this.pagination.merge = true;
        this.loadMore.next(this.pagination);

        if (this.target) {
            this.target.pagination.value.merge = this.pagination.merge;
            this.target.pagination.value.skipCount = this.pagination.skipCount;
            this.isLoading = true;
            this.target.updatePagination(<PaginationModel> this.pagination);
        }
    }

    ngOnDestroy() {
        if (this.paginationSubscription) {
            this.paginationSubscription.unsubscribe();
        }
    }
}
