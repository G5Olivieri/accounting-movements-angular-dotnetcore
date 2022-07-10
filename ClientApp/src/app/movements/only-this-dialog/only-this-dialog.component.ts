import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

type DataType = {
  name: string
}

@Component({
  selector: 'app-only-this-dialog',
  templateUrl: './only-this-dialog.component.html',
  styleUrls: ['./only-this-dialog.component.scss']
})
export class OnlyThisDialogComponent implements OnInit {
  choice = '0';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataType,
    public dialogRef: MatDialogRef<OnlyThisDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close(this.choice)
  }

  keyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.close();
    }
  }
}
