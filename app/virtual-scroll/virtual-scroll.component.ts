import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FSITEMS } from '../data/items';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss']
})
export class VirtualScrollComponent {

  items$ = Observable.create(observer => {
      observer.next(FSITEMS);
      observer.complete();}
    );
  
  itm = FSITEMS;

   trackById(index: number, item: any) {
     return item.id;
  }

  
  isHeader(item: string) {
    return item.startsWith('involvement');
  }

   protected buffer: string[] = this.itm.slice(0, 200);
   protected loading: boolean;


  public fetchMore(event: IPageInfo) {
   console.log(JSON.stringify(event));
   // nothing else to be fetched
   if (this.itm.length === this.buffer.length) return; 

   if (event.endIndex !== this.buffer.length-1) return;
   console.log(JSON.stringify(event));
        this.loading = true;
        this.fetchNextChunk(this.buffer.length, 300).then(chunk => {
            //console.log(JSON.stringify(chunk));
            this.buffer = this.buffer.concat(chunk);
            this.loading = false;
        }, () => this.loading = false);
  }

   public timer;

   protected fetchNextChunk(skip: number, limit: number): Promise<string[]> {
        console.log(skip + " " + limit);
        return new Promise((resolve, reject) => {
           clearTimeout(this.timer);
           this.timer = setTimeout(() => {
             this.loading = false;
             resolve([...this.itm.slice(skip, skip + limit)]);
           }, 1400);
        });
    }

}