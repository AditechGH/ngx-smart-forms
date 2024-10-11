import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number, decimalPoint = 2): string {
    if (isNaN(sizeInBytes) || sizeInBytes === 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const size = (sizeInBytes / Math.pow(1024, index)).toFixed(decimalPoint);

    return `${size} ${units[index]}`;
  }
}
