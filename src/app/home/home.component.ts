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
      {id: 'jpg', name: 'JPG', checked: false}
    );
  }

  test(){
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.send('getSettings', 'caca');
      this.electronService.ipcRenderer.on('resultSettings', (evt, args) => {
      });
    }
  }

  fromDirectoryChangeEvent($event) {
    console.log($event);
  }

  openDialog(destination: string) {
    if (this.electronService.isElectron) {

      (async () => {
          const result = await this.electronService.ipcRenderer.invoke('select-dirs');
          if (destination === 'from') {
            this.pathFrom = result.filePaths[0];
          } else if (destination === 'to') {
            this.pathTo = result.filePaths[0];
          }
      })();

      /*
        this.electronService.ipcRenderer.send('select-dirs')
        this.electronService.ipcRenderer.on('asynchronous-reply', (event, result) => {
          debugger;
          if (destination === 'from') {
            this.pathFrom = result.filePaths[0];
          } else if (destination === 'to') {
            this.pathTo = result.filePaths[0];
          }
          debugger;
        })
        */
    }
  }


  doIt() {
    if (this.electronService.isElectron) {
      this.electronService.ipcRenderer.send('transfert', this.extensions.filter(opt => opt.checked).map(opt => opt.id));
    }
  }
}
