import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pathFrom = '';
  pathTo = '';
  public extensions: {id: string, name: string, checked: boolean}[];

  constructor(private router: Router, private electronService: ElectronService) { }

  ngOnInit(): void {
    this.extensions = [];
    this.extensions.push(
      {id: 'png', name: 'PNG', checked: false}, 
      {id: 'jpg', name: 'JPG', checked: false},
      {id: 'mp4', name: 'MP4', checked: false}
    );
  }

  openDialogTo() {
    if (this.electronService.isElectron) {
      (async () => {
          const result = await this.electronService.ipcRenderer.invoke('to-folder');
            this.pathTo = result.filePaths[0];
      })();
    }
  }

  openDialogFrom() {
    if (this.electronService.isElectron) {
      (async () => {
          const result = await this.electronService.ipcRenderer.invoke('from-folder');
            this.pathFrom = result.filePaths[0];
      })();
    }
  }


  doIt() {
    if (this.electronService.isElectron) {
        (async () => {
          const extensions = this.extensions.filter(opt => opt.checked).map(opt => opt.id)
          await this.electronService.ipcRenderer.invoke('transfert', extensions);
      })();
    }
  }
}
